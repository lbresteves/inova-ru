import { useEffect, useState } from "react";

function calculateRemainingSeconds(expiresAt: string): number {
  return Math.max(
    0,
    Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1_000),
  );
}

export function usePaymentCountdown(expiresAt?: string): number {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    expiresAt ? calculateRemainingSeconds(expiresAt) : 0,
  );

  useEffect(() => {
    if (!expiresAt) {
      setRemainingSeconds(0);
      return;
    }

    setRemainingSeconds(calculateRemainingSeconds(expiresAt));
    const interval = setInterval(() => {
      setRemainingSeconds(calculateRemainingSeconds(expiresAt));
    }, 1_000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return remainingSeconds;
}
