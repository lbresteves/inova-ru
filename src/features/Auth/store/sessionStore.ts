import { create } from "zustand";
import type {
  AnonymousReason,
  AuthSession,
  SessionStatus,
  SessionUser,
} from "../types/AuthSession";

type SessionState = {
  anonymousReason: AnonymousReason | null;
  session: AuthSession | null;
  status: SessionStatus;
  user: SessionUser | null;
  setAnonymous: (reason?: AnonymousReason) => void;
  setAuthenticated: (session: AuthSession) => void;
  clearAnonymousReason: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  anonymousReason: null,
  session: null,
  status: "initializing",
  user: null,
  clearAnonymousReason: () => set({ anonymousReason: null }),
  setAnonymous: (reason = "unknown") =>
    set({
      anonymousReason: reason,
      session: null,
      status: "anonymous",
      user: null,
    }),
  setAuthenticated: (session) =>
    set({
      anonymousReason: null,
      session,
      status: "authenticated",
      user: session.user,
    }),
}));
