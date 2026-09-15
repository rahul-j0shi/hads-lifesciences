"""Validated application settings.

Values come from the process environment. Local development loads `backend/.env`
explicitly; hosted environments receive them from the Vercel project settings.
Importing this module performs no I/O.
"""

from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Startup configuration. Invalid values fail fast, without echoing secrets."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_env: Literal["local", "test", "prototype"] = "local"
    log_level: str = "INFO"

    # Kept as a plain string on purpose. Pydantic's MongoDsn normalizes the value
    # and appends the default port, which makes a mongodb+srv:// URI invalid:
    # PyMongo rejects it with "SRV URIs must not include a port number".
    mongodb_uri: str
    mongodb_database: str = "hads_prototype"

    # Exact origins only. Empty in the deployed single-origin setup, where the
    # site and the API share a domain and no cross-origin request occurs.
    cors_allowed_origins: list[str] = Field(default_factory=list)

    # Bounds for the readiness probe. The whole request stays under
    # readiness_timeout_seconds so a hung driver cannot hold a function open.
    mongo_pool_max_size: int = 5
    readiness_timeout_seconds: float = 5.0

    @field_validator("mongodb_uri")
    @classmethod
    def check_mongodb_scheme(cls, value: str) -> str:
        """Check the scheme without rewriting the URI, and never echo its content."""
        if not value.startswith(("mongodb://", "mongodb+srv://")):
            raise ValueError("mongodb_uri must start with mongodb:// or mongodb+srv://")
        return value

    @field_validator("cors_allowed_origins")
    @classmethod
    def reject_wildcard_origin(cls, value: list[str]) -> list[str]:
        """A wildcard origin would defeat the exact-origin rule in the security design."""
        for origin in value:
            if origin == "*":
                raise ValueError("cors_allowed_origins must list exact origins, not '*'")
            if origin.endswith("/"):
                raise ValueError(f"origin must not end with a slash: {origin}")
        return value


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return the process-wide settings, constructed once."""
    return Settings()  # type: ignore[call-arg]
