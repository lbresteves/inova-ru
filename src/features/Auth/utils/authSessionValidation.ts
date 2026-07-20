import type { AuthSession, SessionUser } from "../types/AuthSession";

const CPF_PATTERN = /^\d{11}$/;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSessionUser(value: unknown): value is SessionUser {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const user = value as Record<string, unknown>;
  return (
    isNonEmptyString(user.email) &&
    isNonEmptyString(user.name) &&
    typeof user.isEmployee === "boolean" &&
    typeof user.isStudent === "boolean"
  );
}

export function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const session = value as Record<string, unknown>;
  return (
    session.schemaVersion === 1 &&
    isNonEmptyString(session.token) &&
    typeof session.subjectCpf === "string" &&
    CPF_PATTERN.test(session.subjectCpf) &&
    isSessionUser(session.user)
  );
}
