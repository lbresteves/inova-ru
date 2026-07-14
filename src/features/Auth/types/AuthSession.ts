import type { SessionUser } from "@shared/store";

export type AuthSession = {
  token: string;
  user: SessionUser;
};
