import type { LoginForm } from "../types/LoginForm";

export type LoginErrors = Partial<Record<keyof LoginForm, string>>;

export function validateLogin(form: LoginForm): LoginErrors {
  const errors: LoginErrors = {};
  const institutionalId = form.institutionalId.trim();

  if (!institutionalId) {
    errors.institutionalId = "Informe seu CPF.";
  } else if (!/^\d+$/.test(institutionalId)) {
    errors.institutionalId = "Use somente números.";
  } else if (!/^\d{11}$/.test(institutionalId)) {
    errors.institutionalId = "Informe um CPF com 11 números.";
  }

  if (!form.password.trim()) {
    errors.password = "Informe sua senha institucional.";
  }

  return errors;
}
