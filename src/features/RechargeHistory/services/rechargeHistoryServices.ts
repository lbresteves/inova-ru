import { authenticatedRuApi } from "@features/Auth";
import { RechargeHistoryRepository } from "./RechargeHistoryRepository";

export const rechargeHistoryRepository = new RechargeHistoryRepository(authenticatedRuApi);
