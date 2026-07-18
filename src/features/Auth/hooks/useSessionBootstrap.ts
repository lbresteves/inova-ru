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
      .getSession()
      .then((session) => {
        if (!active) {
          return;
        }

        if (!session) {
          setAnonymous("explicit");
          return;
        }

        setAuthenticated(session);
      })
      .catch(() => {
        if (active) {
          setAnonymous("storage-error");
        }
      });

    return () => {
      active = false;
    };
  }, [setAnonymous, setAuthenticated, status]);

  return status;
}
