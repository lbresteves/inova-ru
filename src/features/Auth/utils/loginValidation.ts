import type { LoginForm } from "../types/LoginForm";

export type LoginErrors = Partial<Record<keyof LoginForm, string>>;

export function validateLogin(form: LoginForm): LoginErrors {
  const errors: LoginErrors = {};
  if (form.cpf.length !== 11) {
    errors.cpf = "Informe um CPF com 11 dígitos.";
  }
  if (!form.password.trim()) {
    errors.password = "Informe sua senha institucional.";
  }
  return errors;
}
