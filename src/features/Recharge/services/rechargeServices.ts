import { authenticatedRuApi } from "@features/Auth";
import { RechargeRepository } from "./RechargeRepository";

export const rechargeRepository = new RechargeRepository(authenticatedRuApi);
