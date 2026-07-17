import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useTheme } from "@emotion/react";
import { useQueryClient } from "@tanstack/react-query";

import { AppButton, HeaderBack, IconButton } from "@shared/components";
import { usePaymentCountdown } from "../hooks/usePaymentCountdown";
import { usePaymentStatusQuery } from "../hooks/usePaymentStatusQuery";
import { useRechargeBalanceQuery } from "../hooks/useRechargeBalanceQuery";
import { rechargeKeys } from "../hooks/rechargeKeys";
import type { CreatedPayment, PaymentStatus } from "../types/Recharge";
import { formatCurrency } from "../utils/currency";
import { creditPaymentBalance } from "../utils/rechargeCache";
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
  QrUnavailable,
  Screen,
  Scroll,
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

function failureCopy(status: PaymentStatus) {
  switch (status) {
    case "rejected":
      return "O pagamento foi recusado. Você pode gerar um novo pagamento.";
    case "cancelled":
      return "O pagamento foi cancelado. Você pode gerar um novo pagamento.";
    case "expired":
      return "Não identificamos o pagamento no tempo esperado, ou o PIX expirou. Você pode gerar um novo pagamento.";
    default:
      return "Não foi possível confirmar o pagamento. Você pode gerar um novo pagamento.";
  }
}

export default function PaymentScreen() {
  const router = useRouter();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ paymentId?: string | string[] }>();
  const paymentId = readParam(params.paymentId);
  const payment = queryClient.getQueryData<CreatedPayment>(
    rechargeKeys.payment(paymentId),
  );
  const balanceQuery = useRechargeBalanceQuery();
  const statusQuery = usePaymentStatusQuery(paymentId, Boolean(payment));
  const remainingSeconds = usePaymentCountdown(payment?.expiresAt);
  const [copyFeedback, setCopyFeedback] = useState<string>();

  const status = statusQuery.data?.status ?? payment?.status ?? "pending";
  const isCredited = statusQuery.data?.credited === true;
  const balanceAlreadyCredited = payment?.balanceCredited === true;

  useEffect(() => {
    if (
      payment &&
      status === "approved" &&
      isCredited &&
      !balanceAlreadyCredited
    ) {
      creditPaymentBalance(queryClient, paymentId);
    }
  }, [
    balanceAlreadyCredited,
    isCredited,
    payment,
    paymentId,
    queryClient,
    status,
  ]);

  useEffect(() => {
    if (!copyFeedback) {
      return;
    }

    const timeout = setTimeout(() => setCopyFeedback(undefined), 2_000);
    return () => clearTimeout(timeout);
  }, [copyFeedback]);
  const creditedBalance = balanceQuery.data?.current;

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

  if (status === "approved" && isCredited && balanceAlreadyCredited) {
    return (
      <Screen>
        <HeaderBack title="Pagamento" onReturnPress={() => router.back()} />
        <PaymentResult
          description={`Você adicionou ${formatCurrency(payment.amount)} em créditos.`}
          onPrimaryPress={() => router.replace("/main/home")}
          primaryLabel="Voltar ao início"
          title="Recarga confirmada!"
          type="success"
        >
          <BalanceCard>
            <BalanceLabel>Saldo atual</BalanceLabel>
            <BalanceValue>
              {creditedBalance === undefined
                ? "Saldo atualizado"
                : formatCurrency(creditedBalance)}
            </BalanceValue>
          </BalanceCard>
        </PaymentResult>
      </Screen>
    );
  }

  if (["rejected", "cancelled", "expired"].includes(status)) {
    return (
      <Screen>
        <HeaderBack title="Pagamento" onReturnPress={() => router.back()} />
        <PaymentResult
          description={failureCopy(status)}
          onPrimaryPress={() => router.replace("/main/recharge")}
          onSecondaryPress={() => router.replace("/main/home")}
          primaryLabel="Tentar novamente"
          secondaryLabel="Voltar ao início"
          title="Pagamento não detectado"
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
            {payment.qrCodeUri ? (
              <QrImage
                accessibilityIgnoresInvertColors
                accessibilityLabel="QR Code para pagamento"
                resizeMode="contain"
                source={{ uri: payment.qrCodeUri }}
              />
            ) : (
              <QrUnavailable>
                <Hint>QR Code indisponível.</Hint>
              </QrUnavailable>
            )}
          </QrCard>

          <AmountText>{formatCurrency(payment.amount)}</AmountText>

          <CodeBox>
            <CodeText numberOfLines={1} selectable>
              {payment.copyPasteCode}
            </CodeText>
            <IconButton
              accessibilityLabel="Copiar código de pagamento"
              color="primary"
              name="doc.on.doc"
              onPress={() => void copyPaymentCode()}
              size={20}
            />
          </CodeBox>
          {copyFeedback ? (
            <CopyFeedback accessibilityLiveRegion="polite">
              {copyFeedback}
            </CopyFeedback>
          ) : null}
          <WaitingCard>
            <ActivityIndicator color={theme.colors.primary} size="small" />
            <WaitingTexts>
              <WaitingTitle>
                {status === "approved"
                  ? "Pagamento aprovado..."
                  : "Aguardando pagamento..."}
              </WaitingTitle>
              <WaitingDescription>
                {status === "approved"
                  ? "Aguardando a confirmação do crédito."
                  : "A confirmação é automática."}
              </WaitingDescription>
            </WaitingTexts>
          </WaitingCard>

          <Expiration>
            Expira em {formatCountdown(remainingSeconds)}
          </Expiration>
          <Hint>Não feche esta tela até a confirmação.</Hint>

          {statusQuery.isError ? (
            <PollingError>
              <PollingErrorText>
                Não foi possível consultar o pagamento.
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
