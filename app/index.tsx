import { useSessionStore } from "@features/Auth";
import { Redirect } from "expo-router";

export default function IndexRoute() {
  const status = useSessionStore((state) => state.status);

  return (
    <Redirect
      href={status === "authenticated" ? "/main/home" : "/auth/login"}
    />
  );
}
