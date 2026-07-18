import { useSessionStore } from "@features/Auth";
import { useQuery } from "@tanstack/react-query";
import { creditAccountRepository } from "../services/creditAccountServices";
import { creditAccountKeys } from "../utils/creditAccountKeys";

export function useCreditAccountQuery() {
  const session = useSessionStore((state) => state.session);

  return useQuery({
    enabled: Boolean(session?.subjectCpf),
    queryFn: ({ signal }) => creditAccountRepository.getAccount(signal),
    queryKey: creditAccountKeys.account(session?.subjectCpf),
    staleTime: 30_000,
  });
}
