import { useCreditAccountQuery } from "@features/CreditAccount";

export function useRechargeBalanceQuery() {
  const accountQuery = useCreditAccountQuery();

  return {
    ...accountQuery,
    data: accountQuery.data?.balance,
  };
}
