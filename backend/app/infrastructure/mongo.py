"""MongoDB access, narrowed to what the application actually needs.

The readiness route depends on the `ReadinessProbe` protocol, not on PyMongo, so
unit tests can supply a probe that succeeds, times out or fails without a server.
"""

from __future__ import annotations

import asyncio
from typing import TYPE_CHECKING, Any, Protocol

if TYPE_CHECKING:
    from pymongo import AsyncMongoClient


class ReadinessProbe(Protocol):
    """The single capability the readiness route requires."""

    async def check(self) -> bool:
        """Return True when the dependency answered within its deadline."""
        ...


class MongoReadinessProbe:
    """Pings MongoDB under a deadline.

    Owns no connection of its own: the client is created and closed by the
    application lifespan, so probe construction has no side effects.
    """

    def __init__(self, client: "AsyncMongoClient[Any]", timeout_seconds: float) -> None:
        self._client = client
        self._timeout_seconds = timeout_seconds

    async def check(self) -> bool:
        try:
            async with asyncio.timeout(self._timeout_seconds):
                await self._client.admin.command("ping")
        except Exception:  # noqa: BLE001 - any driver failure means "not ready"
            # Callers translate this into a 503. The reason stays in logs, never
            # in the response body, so driver and host details are not disclosed.
            return False
        return True


def create_mongo_client(uri: str, pool_max_size: int) -> "AsyncMongoClient[Any]":
    """Build a client with bounded pooling and timeouts.

    The API runs as a serverless function, so many short-lived instances can exist
    at once against a shared Atlas connection ceiling. The pool maximum stays small
    for that reason; see the hosting decision record.
    """
    # Imported here, not at module scope. The driver is only needed for readiness,
    # and a driver import problem must not stop the process from serving liveness
    # and welcome, which is what a top-level import failure would cause.
    from pymongo import AsyncMongoClient

    return AsyncMongoClient(
        uri,
        maxPoolSize=pool_max_size,
        minPoolSize=0,
        serverSelectionTimeoutMS=2000,
        connectTimeoutMS=2000,
        socketTimeoutMS=3000,
        tz_aware=True,
    )
