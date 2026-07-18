import type { QueryClient } from "@tanstack/react-query";
import { creditAccountKeys } from "@features/CreditAccount";

export async function invalidateRechargeBalance(
  queryClient: QueryClient,
): Promise<void> {
  await queryClient.invalidateQueries({ queryKey: creditAccountKeys.all });
}
