import { isAxiosError, isCancel } from "axios";
import { ApiError } from "./ApiError";

type ErrorBody = {
  message?: unknown;
};

function getResponseMessage(data: unknown): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof (data as ErrorBody).message === "string"
  ) {
    return (data as ErrorBody).message as string;
  }

  return "Não foi possível concluir a solicitação.";
}

export function normalizeAxiosError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (!isAxiosError(error)) {
    return new ApiError(
      "Ocorreu um erro inesperado.",
      "unexpected",
      undefined,
      undefined,
      error,
    );
  }

  if (isCancel(error) || error.code === "ERR_CANCELED") {
    return new ApiError("A solicitação foi cancelada.", "cancelled");
  }

  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return new ApiError(
      "O servidor demorou para responder. Tente novamente.",
      "timeout",
    );
  }

  if (error.response) {
    return new ApiError(
      getResponseMessage(error.response.data),
      "http",
      error.response.status,
      error.response.data,
    );
  }

  return new ApiError(
    "Não foi possível conectar ao servidor.",
    "network",
  );
}
