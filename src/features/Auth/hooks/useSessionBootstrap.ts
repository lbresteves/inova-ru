import { useEffect } from "react";
import { authSessionStorage } from "../services/authServices";
import { useSessionStore } from "../store/sessionStore";

export function useSessionBootstrap() {
  const status = useSessionStore((state) => state.status);
  const setAnonymous = useSessionStore((state) => state.setAnonymous);
  const setAuthenticated = useSessionStore(
    (state) => state.setAuthenticated,
  );

  useEffect(() => {
    if (status !== "initializing") {
      return;
    }

    let active = true;

    void authSessionStorage
      .getAccessToken()
      .then((token) => {
        if (!active) {
          return;
        }

        if (token) {
          setAuthenticated(null);
        } else {
          setAnonymous();
        }
      })
      .catch(() => {
        if (active) {
          setAnonymous();
        }
      });

    return () => {
      active = false;
    };
  }, [setAnonymous, setAuthenticated, status]);

  return status;
}
