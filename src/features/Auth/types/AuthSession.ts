export type SessionUser = {
  email: string;
  isEmployee: boolean;
  isStudent: boolean;
  name: string;
};

export type AuthSession = {
  expiresAt: string | null;
  subjectCpf: string;
  token: string;
  user: SessionUser;
};

export type AnonymousReason =
  | "explicit"
  | "expired"
  | "invalid"
  | "storage-error"
  | "unknown";

export type SessionStatus =
  | "initializing"
  | "anonymous"
  | "authenticated";
