import { authenticatedRuApi } from "@features/Auth";

type CreditBalanceResponseDto = {
  saldo: {
    credito_disponivel: number;
  };
};

export async function fetchCurrentCreditBalanceAsync(): Promise<number> {
  const response = await authenticatedRuApi.get<CreditBalanceResponseDto>(
    "/creditos/saldo",
  );

  return Number(response.saldo.credito_disponivel);
}
