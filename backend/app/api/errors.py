"""Problem responses and the request-identifier middleware.

Every error leaves the application in the RFC 9457 shape published in the API
contract. Exceptions, stack traces, driver messages and hostnames never reach a
client.
"""

from __future__ import annotations

import logging
import re
import uuid
from collections.abc import Awaitable, Callable

from fastapi import FastAPI, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)

REQUEST_ID_HEADER = "X-Request-ID"
PROBLEM_MEDIA_TYPE = "application/problem+json"

# A supplied request id is echoed only when it is short and unremarkable, so a
# client cannot inject control characters or unbounded text into logs.
_SAFE_REQUEST_ID = re.compile(r"^[A-Za-z0-9._-]{1,128}$")


def resolve_request_id(candidate: str | None) -> str:
    """Return the supplied identifier when it is safe, otherwise a fresh one."""
    if candidate and _SAFE_REQUEST_ID.match(candidate):
        return candidate
    return uuid.uuid4().hex


def problem_response(
    status: int, title: str, detail: str, request_id: str, headers: dict[str, str] | None = None
) -> JSONResponse:
    """Build the documented problem body for any failure."""
    response_headers = {REQUEST_ID_HEADER: request_id, "Cache-Control": "no-store"}
    if headers:
        response_headers.update(headers)
    return JSONResponse(
        status_code=status,
        media_type=PROBLEM_MEDIA_TYPE,
        headers=response_headers,
        content={
            "type": "about:blank",
            "title": title,
            "status": status,
            "detail": detail,
            "request_id": request_id,
        },
    )


def register_error_handling(app: FastAPI) -> None:
    """Attach the request-id middleware and contract-shaped error handlers."""

    @app.middleware("http")
    async def attach_request_id(
        request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        request_id = resolve_request_id(request.headers.get(REQUEST_ID_HEADER))
        request.state.request_id = request_id
        response = await call_next(request)
        response.headers[REQUEST_ID_HEADER] = request_id
        return response

    @app.exception_handler(StarletteHTTPException)
    async def handle_http_exception(
        request: Request, exc: StarletteHTTPException
    ) -> JSONResponse:
        request_id = getattr(request.state, "request_id", resolve_request_id(None))
        titles = {404: "Not Found", 405: "Method Not Allowed"}
        title = titles.get(exc.status_code, "Request Failed")
        detail = exc.detail if isinstance(exc.detail, str) else title
        headers = {"Allow": exc.headers["Allow"]} if exc.headers and "Allow" in exc.headers else None
        return problem_response(exc.status_code, title, detail, request_id, headers)

    @app.exception_handler(RequestValidationError)
    async def handle_validation_error(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        request_id = getattr(request.state, "request_id", resolve_request_id(None))
        return problem_response(
            422, "Unprocessable Content", "The request could not be validated.", request_id
        )

    @app.exception_handler(Exception)
    async def handle_unexpected_error(request: Request, exc: Exception) -> JSONResponse:
        request_id = getattr(request.state, "request_id", resolve_request_id(None))
        # Full detail goes to the log, correlated by request id. The client is told nothing.
        logger.exception("unhandled error", extra={"request_id": request_id})
        return problem_response(
            500, "Internal Server Error", "An unexpected error occurred.", request_id
        )
