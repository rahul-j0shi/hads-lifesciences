"""Public welcome operation.

Constant, side-effect-free and independent of the database, so the site stays
useful while MongoDB is unavailable.
"""

from __future__ import annotations

from fastapi import APIRouter, Response
from pydantic import BaseModel

router = APIRouter()


class WelcomeResponse(BaseModel):
    """Public welcome DTO. Matches WelcomeResponse in the API contract."""

    name: str
    message: str


@router.get(
    "/api/v1/welcome",
    operation_id="getWelcome",
    response_model=WelcomeResponse,
    summary="Minimal frontend and API connection check",
)
async def get_welcome(response: Response) -> WelcomeResponse:
    # Up to 60 seconds of a stale copy is acceptable for a constant response.
    # Vary: Origin keeps a shared cache from serving one origin's CORS headers
    # to another.
    response.headers["Cache-Control"] = "public, max-age=60"
    response.headers["Vary"] = "Origin"
    return WelcomeResponse(name="HADS Lifesciences", message="Website coming soon.")
