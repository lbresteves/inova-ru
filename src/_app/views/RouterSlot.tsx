import { Slot, useRouter, useSegments } from "expo-router";
const RouterSlot = () => {
  const segments = useSegments();
  const router = useRouter();
  void segments;
  void router;

  return <Slot />;
};

export default RouterSlot;
