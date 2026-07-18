import { useSessionStore } from "@features/Auth";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { activePaymentStorage } from "../services/ActivePaymentStorage";
import type { ActivePayment, CreatedPayment } from "../types/Recharge";
import { rechargeKeys } from "../utils/rechargeKeys";

export function useActivePayment(paymentId: string) {
  const queryClient = useQueryClient();
  const session = useSessionStore((state) => state.session);
  const cachedPayment = queryClient.getQueryData<CreatedPayment>(
    rechargeKeys.payment(paymentId),
  );
  const [storedPayment, setStoredPayment] = useState<ActivePayment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    void (async () => {
      if (!session?.subjectCpf || !paymentId) {
        setStoredPayment(null);
        setIsLoading(false);
        return;
      }

      const activePayment = await activePaymentStorage.get(session.subjectCpf);
      if (!mounted) {
        return;
      }

      setStoredPayment(activePayment?.id === paymentId ? activePayment : null);
      setIsLoading(false);
    })().catch(() => {
      if (mounted) {
        setStoredPayment(null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [paymentId, session?.subjectCpf]);

  return {
    isLoading,
    payment: cachedPayment ?? storedPayment,
    storedPayment,
  };
}
