"""Application composition root.

`app` is the ASGI application the hosting platform loads. Connections are
acquired in lifespan and released on shutdown, including after a partial startup
failure. Importing this module opens no connection and starts no task.
"""

from __future__ import annotations

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import health, welcome
from app.api.errors import register_error_handling
from app.infrastructure.mongo import MongoReadinessProbe, create_mongo_client
from app.settings import Settings, get_settings

logger = logging.getLogger(__name__)


class UnconfiguredProbe:
    """Stands in when configuration is unusable, so readiness can answer honestly."""

    async def check(self) -> bool:
        return False


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Own the MongoDB client for the lifetime of the application."""
    settings: Settings | None = app.state.settings
    if settings is None:
        # Configuration failed. Liveness and welcome still serve, readiness reports
        # 503, and the reason is in the log rather than in any response body.
        app.state.readiness_probe = UnconfiguredProbe()
        yield
        return
    client = create_mongo_client(str(settings.mongodb_uri), settings.mongo_pool_max_size)
    app.state.mongo_client = client
    app.state.readiness_probe = MongoReadinessProbe(client, settings.readiness_timeout_seconds)
    try:
        yield
    finally:
        # Serverless shutdown is capped at roughly 500 ms after SIGTERM, so this
        # close must not block on a network round trip. It also runs when startup
        # failed partway, which is why it sits in a finally block.
        try:
            await client.close()
        except Exception:  # noqa: BLE001 - shutdown must not raise
            logger.warning("mongo client close failed during shutdown", exc_info=True)


def create_app(settings: Settings | None = None) -> FastAPI:
    """Assemble the application. Tests call this with their own settings.

    A configuration failure must not take down the whole service. Liveness proves
    the process serves HTTP and readiness reports dependency health, so a bad or
    missing setting degrades readiness rather than crashing every route. The
    invalid value itself is never echoed.
    """
    resolved: Settings | None = settings
    config_error: str | None = None
    if resolved is None:
        try:
            resolved = get_settings()
        except Exception as exc:  # noqa: BLE001 - startup must stay diagnosable
            config_error = type(exc).__name__
            resolved = None

    logging.basicConfig(level=(resolved.log_level.upper() if resolved else "INFO"))
    if config_error is not None:
        logging.getLogger(__name__).error(
            "settings validation failed (%s); readiness will report 503", config_error
        )

    app = FastAPI(
        title="HADS Prototype API",
        version="0.1.0",
        lifespan=lifespan,
        docs_url=None,
        redoc_url=None,
        openapi_url=None,
    )
    app.state.settings = resolved
    app.state.config_error = config_error
    app.state.readiness_probe = UnconfiguredProbe()

    # Deployed, the site and the API share one origin, so this list is empty and
    # the middleware adds nothing. It exists for local development, where the Vite
    # dev server runs on a different port.
    if resolved and resolved.cors_allowed_origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=resolved.cors_allowed_origins,
            allow_credentials=False,
            allow_methods=["GET"],
            allow_headers=["*"],
        )

    register_error_handling(app)
    app.include_router(welcome.router)
    app.include_router(health.router)
    return app


app = create_app()
