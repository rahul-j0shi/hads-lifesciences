"""MongoDB access, narrowed to what the application actually needs.

The readiness route depends on the `ReadinessProbe` protocol, not on PyMongo, so
unit tests can supply a probe that succeeds, times out or fails without a server.
"""

from __future__ import annotations

import asyncio
from typing import Protocol

from pymongo import AsyncMongoClient
from pymongo.errors import PyMongoError


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

    def __init__(self, client: AsyncMongoClient, timeout_seconds: float) -> None:
        self._client = client
        self._timeout_seconds = timeout_seconds

    async def check(self) -> bool:
        try:
            async with asyncio.timeout(self._timeout_seconds):
                await self._client.admin.command("ping")
        except (PyMongoError, asyncio.TimeoutError, OSError):
            # Callers translate this into a 503. The reason stays in logs, never
            # in the response body, so driver and host details are not disclosed.
            return False
        return True


def create_mongo_client(uri: str, pool_max_size: int) -> AsyncMongoClient:
    """Build a client with bounded pooling and timeouts.

    The API runs as a serverless function, so many short-lived instances can exist
    at once against a shared Atlas connection ceiling. The pool maximum stays small
    for that reason; see the hosting decision record.
    """
    return AsyncMongoClient(
        uri,
        maxPoolSize=pool_max_size,
        minPoolSize=0,
        serverSelectionTimeoutMS=2000,
        connectTimeoutMS=2000,
        socketTimeoutMS=3000,
        tz_aware=True,
    )
