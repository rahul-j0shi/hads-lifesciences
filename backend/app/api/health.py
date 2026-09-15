"""Liveness and readiness operations.

Liveness proves the process serves HTTP and must never touch MongoDB, so a
database outage cannot trigger a platform restart loop. Readiness reports
dependency health and is used by release verification, not by platform checks.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, Request, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.api.errors import problem_response, resolve_request_id
from app.infrastructure.mongo import ReadinessProbe

router = APIRouter()


class LivenessResponse(BaseModel):
    """Matches LivenessResponse in the API contract."""

    status: str


class ReadinessResponse(BaseModel):
    """Matches ReadinessResponse in the API contract."""

    status: str


def get_readiness_probe(request: Request) -> ReadinessProbe:
    """Supply the probe assembled by the composition root."""
    probe: ReadinessProbe = request.app.state.readiness_probe
    return probe


@router.get(
    "/health/live",
    operation_id="getLiveness",
    response_model=LivenessResponse,
    summary="Process is serving HTTP",
)
async def get_liveness(response: Response) -> LivenessResponse:
    response.headers["Cache-Control"] = "no-store"
    return LivenessResponse(status="alive")


@router.get(
    "/health/ready",
    operation_id="getReadiness",
    summary="Required dependencies are reachable",
    responses={503: {"description": "Service Unavailable"}},
)
async def get_readiness(
    request: Request,
    probe: ReadinessProbe = Depends(get_readiness_probe),
) -> JSONResponse:
    request_id = getattr(request.state, "request_id", resolve_request_id(None))
    if not await probe.check():
        return problem_response(
            503,
            "Service Unavailable",
            "A required dependency is unavailable.",
            request_id,
        )
    return JSONResponse(
        status_code=200,
        content={"status": "ready"},
        headers={"Cache-Control": "no-store"},
    )
