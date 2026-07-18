import { clearAuthenticatedQueryData } from "@/src/_app/query";
import { useMutation } from "@tanstack/react-query";
import { authRepository, authSessionStorage } from "../services/authServices";
import { useSessionStore } from "../store/sessionStore";
import type { LoginForm } from "../types/LoginForm";

export function useLoginMutation() {
  const setAuthenticated = useSessionStore(
    (state) => state.setAuthenticated,
  );

  return useMutation({
    mutationFn: async (form: LoginForm) => {
      const session = await authRepository.login(form);
      await clearAuthenticatedQueryData();
      await authSessionStorage.setSession(session);
      setAuthenticated(session);
      return session;
    },
  });
}
