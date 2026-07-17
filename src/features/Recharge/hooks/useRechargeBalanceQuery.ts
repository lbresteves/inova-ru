import { useQuery } from "@tanstack/react-query";

import { rechargeRepository } from "../services/rechargeServices";
import { rechargeKeys } from "./rechargeKeys";

export function useRechargeBalanceQuery() {
  return useQuery({
    queryKey: rechargeKeys.balance(),
    queryFn: ({ signal }) => rechargeRepository.getBalance(signal),
    staleTime: Number.POSITIVE_INFINITY,
  });
}
