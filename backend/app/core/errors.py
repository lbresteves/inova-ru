from __future__ import annotations

import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("inovaru.demo_api")


class ApiException(Exception):
    def __init__(self, status_code: int, message: str, headers: dict[str, str] | None = None) -> None:
        self.status_code = status_code
        self.message = message
        self.headers = headers or {}


def error_response(status_code: int, message: str, headers: dict[str, str] | None = None) -> JSONResponse:
    return JSONResponse(status_code=status_code, content={"message": message}, headers=headers)


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(ApiException)
    async def handle_api_exception(_: Request, exc: ApiException) -> JSONResponse:
        return error_response(exc.status_code, exc.message, exc.headers)

    @app.exception_handler(RequestValidationError)
    async def handle_validation_error(_: Request, __: RequestValidationError) -> JSONResponse:
        return error_response(422, "Dados inválidos na requisição.")

    @app.exception_handler(StarletteHTTPException)
    async def handle_http_exception(_: Request, exc: StarletteHTTPException) -> JSONResponse:
        messages = {
            404: "Recurso não encontrado.",
            405: "Método não permitido.",
        }
        message = messages.get(exc.status_code)
        if message is None:
            message = exc.detail if isinstance(exc.detail, str) else "Não foi possível concluir a solicitação."
        return error_response(exc.status_code, message, dict(exc.headers or {}))

    @app.exception_handler(Exception)
    async def handle_unexpected_error(request: Request, exc: Exception) -> JSONResponse:
        logger.exception("Unexpected demo API error on %s %s", request.method, request.url.path, exc_info=exc)
        return error_response(500, "Erro interno do servidor.")
