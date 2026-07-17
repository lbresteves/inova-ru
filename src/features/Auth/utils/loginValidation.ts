import type { LoginForm } from "../types/LoginForm";

export type LoginErrors = Partial<Record<keyof LoginForm, string>>;

export function validateLogin(form: LoginForm): LoginErrors {
  const errors: LoginErrors = {};
  const institutionalId = form.institutionalId.trim();

  if (!institutionalId) {
    errors.institutionalId = "Informe seu número de usuário.";
  } else if (!/^\d+$/.test(institutionalId)) {
    errors.institutionalId = "Use somente números.";
  }

  if (!form.password.trim()) {
    errors.password = "Informe sua senha institucional.";
  }

  return errors;
}
