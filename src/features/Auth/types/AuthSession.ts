export type SessionUser = {
  email: string;
  isEmployee: boolean;
  isStudent: boolean;
  name: string;
};

export type AuthSession = {
  schemaVersion: 1;
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
