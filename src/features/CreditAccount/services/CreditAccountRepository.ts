import type { IHttpClient } from "@shared/types/IHttpClient";
import type { CreditAccount } from "../types/CreditAccount";
import type { CreditAccountResponseDto } from "../types/CreditAccountDto";
import { mapCreditAccount } from "../utils/mapCreditAccount";

export class CreditAccountRepository {
  constructor(private readonly httpClient: IHttpClient) {}

  async getAccount(signal?: AbortSignal): Promise<CreditAccount> {
    const response = await this.httpClient.get<CreditAccountResponseDto>(
      "/creditos/saldo",
      { signal },
    );

    return mapCreditAccount(response);
  }
}
