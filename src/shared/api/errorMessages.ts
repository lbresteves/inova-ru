import { ApiError } from "./ApiError";

export function getApiErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return "Ocorreu um erro inesperado. Tente novamente.";
  }

  if (error.kind === "network") {
    return "Sem conexão com o servidor. Verifique sua internet e tente novamente.";
  }

  if (error.kind === "timeout") {
    return "O servidor demorou para responder. Tente novamente.";
  }

  if (error.kind === "cancelled") {
    return "A solicitação foi cancelada.";
  }

  if (error.kind === "contract") {
    return "A resposta da API não está no formato esperado.";
  }

  switch (error.status) {
    case 400:
      return error.message || "Revise os dados enviados e tente novamente.";
    case 401:
      return "Sua sessão expirou. Entre novamente.";
    case 403:
      return "Você não tem permissão para acessar este recurso.";
    case 404:
      return error.message || "Recurso não encontrado.";
    case 422:
      return error.message || "Algum dado informado não é válido.";
    case 429:
      return error.retryAfterSeconds
        ? `Muitas tentativas. Aguarde ${error.retryAfterSeconds}s e tente novamente.`
        : "Muitas tentativas. Aguarde um momento e tente novamente.";
    case 500:
      return "Erro interno do servidor. Tente novamente em instantes.";
    default:
      return error.message || "Não foi possível concluir a solicitação.";
  }
}
