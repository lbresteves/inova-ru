import { useTheme } from "@emotion/react";
import { useSessionStore } from "@features/Auth";
import { useCreditAccountQuery, creditAccountKeys } from "@features/CreditAccount";
import { rechargeHistoryKeys } from "@features/RechargeHistory";
import { getApiErrorMessage } from "@shared/api";
import { AppButton, HeaderBack, IconSymbol } from "@shared/components";
import { useQueryClient } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator } from "react-native";
import { activePaymentStorage } from "../services/ActivePaymentStorage";
import { useActivePayment } from "../hooks/useActivePayment";
import { usePaymentCountdown } from "../hooks/usePaymentCountdown";
import { usePaymentStatusPolling } from "../hooks/usePaymentStatusPolling";
import type { PaymentFlowStatus, PaymentStatus } from "../types/Recharge";
import { formatCurrency } from "../utils/currency";
import { rechargeKeys } from "../utils/rechargeKeys";
import { PaymentQrCode } from "./components/PaymentQrCode";
import { PaymentResult } from "./components/PaymentResult";
import {
  AmountText,
  BalanceCard,
  BalanceLabel,
  BalanceValue,
  CodeBox,
  CodeText,
  CopyButton,
  CopyFeedback,
  Expiration,
  Hint,
  Instruction,
  PaymentContent,
  PollingError,
  PollingErrorText,
  QrCard,
  Screen,
  Scroll,
  TicketButton,
  TicketButtonText,
  WaitingCard,
  WaitingDescription,
  WaitingTexts,
  WaitingTitle,
} from "./styles/PaymentScreen.styled";

function readParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function formatCountdown(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function failureCopy(flowStatus: PaymentFlowStatus, status?: PaymentStatus) {
  if (flowStatus === "pollTimedOut") {
    return "Não foi possível confirmar o pagamento em até 2 minutos. Você pode tentar consultar novamente ou gerar um novo PIX.";
  }

  switch (status) {
    case "rejected":
      return "O pagamento foi recusado. Você pode gerar um novo pagamento.";
    case "cancelled":
      return "O pagamento foi cancelado. Você pode gerar um novo pagamento.";
    case "expired":
      return "O PIX expirou sem confirmação. Você pode gerar um novo pagamento.";
    default:
      return "Não foi possível confirmar o pagamento. Você pode gerar um novo pagamento.";
  }
}

function resolveFlowStatus(
  status: PaymentStatus,
  credited: boolean,
  isTimedOut: boolean,
): PaymentFlowStatus {
  if (isTimedOut) {
    return "pollTimedOut";
  }
  if (status === "approved" && credited) {
    return "credited";
  }
  if (status === "approved") {
    return "approvedAwaitingCredit";
  }
  if (status === "rejected") {
    return "rejected";
  }
  if (status === "cancelled") {
    return "cancelled";
  }
  if (status === "expired") {
    return "expired";
  }
  return "pending";
}

export default function PaymentScreen() {
  const router = useRouter();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const session = useSessionStore((state) => state.session);
  const params = useLocalSearchParams<{ paymentId?: string | string[] }>();
  const paymentId = readParam(params.paymentId);
  const defaultPollingStartedAt = useRef(new Date().toISOString());
  const { isLoading: isPaymentLoading, payment, storedPayment } =
    useActivePayment(paymentId);
  const balanceQuery = useCreditAccountQuery();
  const pollingStartedAt =
    storedPayment?.pollingStartedAt ?? defaultPollingStartedAt.current;
  const statusQuery = usePaymentStatusPolling(
    paymentId,
    Boolean(payment),
    pollingStartedAt,
  );
  const remainingSeconds = usePaymentCountdown(payment?.expiresAt);
  const [copyFeedback, setCopyFeedback] = useState<string>();

  const status = statusQuery.data?.status ?? payment?.status ?? "pending";
  const isCredited = statusQuery.data?.credited === true;
  const flowStatus = resolveFlowStatus(
    status,
    isCredited,
    statusQuery.isTimedOut,
  );

  useEffect(() => {
    if (flowStatus !== "credited") {
      return;
    }

    void activePaymentStorage.remove();
    queryClient.removeQueries({ queryKey: rechargeKeys.payment(paymentId) });
    void queryClient.invalidateQueries({ queryKey: creditAccountKeys.all });
    void queryClient.invalidateQueries({ queryKey: rechargeHistoryKeys.all });
  }, [flowStatus, paymentId, queryClient]);

  useEffect(() => {
    if (!session?.subjectCpf || !statusQuery.data) {
      return;
    }

    void activePaymentStorage.updateStatus(
      session.subjectCpf,
      paymentId,
      statusQuery.data.status,
    );
  }, [paymentId, session?.subjectCpf, statusQuery.data]);

  useEffect(() => {
    if (!["rejected", "cancelled", "expired"].includes(flowStatus)) {
      return;
    }

    void activePaymentStorage.remove();
  }, [flowStatus]);

  useEffect(() => {
    if (!copyFeedback) {
      return;
    }

    const timeout = setTimeout(() => setCopyFeedback(undefined), 2_000);
    return () => clearTimeout(timeout);
  }, [copyFeedback]);

  async function copyPaymentCode() {
    if (!payment?.copyPasteCode) {
      return;
    }

    try {
      await Clipboard.setStringAsync(payment.copyPasteCode);
      setCopyFeedback("Código copiado.");
    } catch {
      setCopyFeedback("Não foi possível copiar o código.");
    }
  }

  async function openTicketUrl() {
    if (payment?.ticketUrl) {
      await WebBrowser.openBrowserAsync(payment.ticketUrl);
    }
  }

  if (isPaymentLoading) {
    return (
      <Screen>
        <HeaderBack title="Pagamento" onReturnPress={() => router.back()} />
        <PaymentContent>
          <ActivityIndicator color={theme.colors.primary} size="small" />
          <Hint>Carregando pagamento...</Hint>
        </PaymentContent>
      </Screen>
    );
  }

  if (!payment) {
    return (
      <Screen>
        <HeaderBack title="Pagamento" onReturnPress={() => router.back()} />
        <PaymentResult
          description="Os dados deste pagamento não estão mais disponíveis neste dispositivo."
          onPrimaryPress={() => router.replace("/main/recharge")}
          primaryLabel="Gerar novo PIX"
          title="Pagamento não encontrado"
          type="failure"
        />
      </Screen>
    );
  }

  if (flowStatus === "credited") {
    return (
      <Screen>
        <HeaderBack title="Pagamento" onReturnPress={() => router.back()} />
        <PaymentResult
          description={`Você adicionou ${formatCurrency(payment.amount)} em créditos.`}
          onPrimaryPress={() => router.replace("/main/home")}
          primaryLabel="Voltar"
          title="Recarga confirmada!"
          type="success"
        >
          <BalanceCard>
            <BalanceLabel>Saldo atual</BalanceLabel>
            <BalanceValue>
              {balanceQuery.data
                ? formatCurrency(balanceQuery.data.balance.current)
                : "Saldo em atualização"}
            </BalanceValue>
          </BalanceCard>
        </PaymentResult>
      </Screen>
    );
  }

  if (["rejected", "cancelled", "expired", "pollTimedOut"].includes(flowStatus)) {
    return (
      <Screen>
        <HeaderBack title="Pagamento" onReturnPress={() => router.back()} />
        <PaymentResult
          description={failureCopy(flowStatus, status)}
          onPrimaryPress={() => router.replace("/main/recharge")}
          onSecondaryPress={() => router.replace("/main/home")}
          primaryLabel="Tentar novamente"
          secondaryLabel="Voltar"
          title={flowStatus === "pollTimedOut" ? "Tempo de confirmação excedido" : "Pagamento não confirmado"}
          type="failure"
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <HeaderBack title="Pagamento PIX" onReturnPress={() => router.back()} />
      <Scroll contentContainerStyle={{ flexGrow: 1 }}>
        <PaymentContent>
          <Instruction>
            Escaneie o QR Code ou copie o código abaixo
          </Instruction>

          <QrCard>
            <PaymentQrCode qrCodeUri={payment.qrCodeUri} />
          </QrCard>

          <AmountText>{formatCurrency(payment.amount)}</AmountText>

          <CodeBox>
            <CodeText numberOfLines={1}>{payment.copyPasteCode}</CodeText>
            <CopyButton onPress={() => void copyPaymentCode()}>
              <IconSymbol color="primary" name="doc.on.doc" size={20} />
            </CopyButton>
          </CodeBox>
          {copyFeedback ? <CopyFeedback>{copyFeedback}</CopyFeedback> : null}

          <TicketButton onPress={() => void openTicketUrl()}>
            <TicketButtonText>Abrir link de pagamento</TicketButtonText>
          </TicketButton>

          <WaitingCard>
            <ActivityIndicator color={theme.colors.primary} size="small" />
            <WaitingTexts>
              <WaitingTitle>
                {flowStatus === "approvedAwaitingCredit"
                  ? "Pagamento aprovado..."
                  : "Aguardando pagamento..."}
              </WaitingTitle>
              <WaitingDescription>
                {flowStatus === "approvedAwaitingCredit"
                  ? "Aguardando a confirmação do crédito pelo servidor."
                  : "A confirmação é automática."}
              </WaitingDescription>
            </WaitingTexts>
          </WaitingCard>

          <Expiration>Expira em {formatCountdown(remainingSeconds)}</Expiration>
          <Hint>Você pode voltar depois; o pagamento será recuperado enquanto estiver válido.</Hint>

          {statusQuery.isError ? (
            <PollingError>
              <PollingErrorText>
                {getApiErrorMessage(statusQuery.error)}
              </PollingErrorText>
              <AppButton
                label="Consultar novamente"
                onPress={() => void statusQuery.refetch()}
                variant="outlined"
              />
            </PollingError>
          ) : null}
        </PaymentContent>
      </Scroll>
    </Screen>
  );
}
