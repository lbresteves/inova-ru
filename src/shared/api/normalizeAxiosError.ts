import { isAxiosError } from "axios";
import { ApiError } from "./ApiError";

type ErrorBody = { message?: unknown };

export function normalizeAxiosError(error: unknown): ApiError {
  if (!isAxiosError(error)) {
    return error instanceof ApiError
      ? error
      : new ApiError("Ocorreu um erro inesperado.");
  }

  if (error.code === "ECONNABORTED") {
    return new ApiError("O servidor demorou para responder. Tente novamente.");
  }

  if (!error.response) {
    return new ApiError(
      "Não foi possível conectar ao servidor. Verifique o Mockoon e a URL da API.",
    );
  }

  const body = error.response.data as ErrorBody | undefined;
  const message =
    body && typeof body.message === "string"
      ? body.message
      : "Não foi possível concluir a solicitação.";

  return new ApiError(message, error.response.status, error.response.data);
}
