import { useEffect, useState } from "react";

function calculateRemainingSeconds(expiresAt: string) {
  return Math.max(
    0,
    Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000),
  );
}

export function usePaymentCountdown(expiresAt?: string) {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    expiresAt ? calculateRemainingSeconds(expiresAt) : 0,
  );

  useEffect(() => {
    if (!expiresAt) return;
    setRemainingSeconds(calculateRemainingSeconds(expiresAt));
    const interval = setInterval(() => {
      setRemainingSeconds(calculateRemainingSeconds(expiresAt));
    }, 1_000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return remainingSeconds;
}
