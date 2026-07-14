import { useSessionStore } from "@shared/store";
import { useMutation } from "@tanstack/react-query";
import type { LoginForm } from "../types/LoginForm";
import { authRepository } from "../services/AuthRepository";

export function useLoginMutation() {
  const setSession = useSessionStore((state) => state.setSession);

  return useMutation({
    mutationFn: (form: LoginForm) => authRepository.login(form),
    onSuccess: (session) => setSession(session.token, session.user),
  });
}
