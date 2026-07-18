import { isAxiosError, isCancel } from "axios";
import { ApiError, type ApiResponseHeaders } from "./ApiError";

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

function normalizeHeaders(headers: unknown): ApiResponseHeaders | undefined {
  if (!headers || typeof headers !== "object") {
    return undefined;
  }

  const result: ApiResponseHeaders = {};
  for (const [key, value] of Object.entries(headers as Record<string, unknown>)) {
    if (typeof value === "string") {
      result[key.toLowerCase()] = value;
    } else if (Array.isArray(value) && value.length > 0) {
      result[key.toLowerCase()] = String(value[0]);
    } else if (value !== undefined && value !== null) {
      result[key.toLowerCase()] = String(value);
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
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
      undefined,
      undefined,
      undefined,
      error,
    );
  }

  if (error.response) {
    return new ApiError(
      getResponseMessage(error.response.data),
      "http",
      error.response.status,
      error.response.data,
      normalizeHeaders(error.response.headers),
      error,
    );
  }

  return new ApiError(
    "Não foi possível conectar ao servidor.",
    "network",
    undefined,
    undefined,
    undefined,
    error,
  );
}
