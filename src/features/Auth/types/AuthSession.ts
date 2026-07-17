export type SessionUser = {
  email: string;
  isEmployee: boolean;
  isStudent: boolean;
  name: string;
};

export type AuthSession = {
  token: string;
  user: SessionUser;
};

export type SessionStatus =
  | "initializing"
  | "anonymous"
  | "authenticated";
