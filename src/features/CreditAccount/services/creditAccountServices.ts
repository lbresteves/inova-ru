import { authenticatedRuApi } from "@features/Auth";
import { CreditAccountRepository } from "./CreditAccountRepository";

export const creditAccountRepository = new CreditAccountRepository(
  authenticatedRuApi,
);
