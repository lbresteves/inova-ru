import { useHomeSummaryQuery, homeKeys, type HomeSummary } from "@features/Home";
import {
  AppButton,
  IconButton,
  IconSymbol,
  PageHeader,
  QueryStateView,
  Screen,
  ScreenContent,
  ScrollScreen,
} from "@shared/components";
import { useQueryClient } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { usePaymentCountdown } from "../hooks/usePaymentCountdown";
import { paymentKeys } from "../hooks/paymentKeys";
import { usePaymentStatusQuery } from "../hooks/usePaymentStatusQuery";
import type { CreatedPayment, PaymentStatus } from "../types/Recharge";
import {
  AmountText,
  BalanceCard,
  BalanceLabel,
  BalanceValue,
  CodeBox,
  CodeText,
  CopyFeedback,
  Expiration,
  FooterInfo,
  Hint,
  PaymentContent,
  PaymentDescription,
  PaymentError,
  PaymentErrorText,
  PixInstruction,
  QrCard,
  QrImage,
  QrUnavailable,
  ResultActions,
  ResultContent,
  ResultDescription,
  ResultIcon,
  ResultTitle,
  WaitingBadge,
  WaitingText,
} from "./styles/PaymentScreen.styled";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(value);
}

function formatCountdown(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function getFailureCopy(status: PaymentStatus) {
  switch (status) {
    case "rejected":
      return {
        title: "Pagamento rejeitado",
        description: "O pagamento não foi aprovado. Gere um novo PIX para tentar novamente.",
      };
    case "cancelled":
      return {
        title: "Pagamento cancelado",
        description: "O pagamento foi cancelado. Você pode gerar um novo PIX.",
      };
    case "expired":
      return {
        title: "PIX expirado",
        description: "O prazo deste PIX terminou. Gere um novo pagamento para continuar.",
      };
    default:
      return {
        title: "Pagamento não detectado",
        description: "Não foi possível confirmar o pagamento.",
      };
  }
}

export default function PaymentScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ paymentId?: string | string[] }>();
  const paymentId = Array.isArray(params.paymentId)
    ? params.paymentId[0]
    : params.paymentId ?? "";
  const payment = queryClient.getQueryData<CreatedPayment>(
    paymentKeys.detail(paymentId),
  );
  const statusQuery = usePaymentStatusQuery(paymentId);
  const homeSummaryQuery = useHomeSummaryQuery();
  const remainingSeconds = usePaymentCountdown(payment?.expiresAt);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const creditedRef = useRef(false);
  const status = statusQuery.data?.status ?? payment?.status ?? "pending";

  useEffect(() => {
    if (status !== "approved" || !payment || creditedRef.current) return;
    creditedRef.current = true;

    // Mockoon does not return the updated balance. Keep the transition visible by
    // updating the balance already obtained from /creditos/saldo with the API amount.
    queryClient.setQueryData<HomeSummary>(homeKeys.summary, (current) =>
      current
        ? {
            ...current,
            balance: Math.min(current.rechargeLimit, current.balance + payment.amount),
          }
        : current,
    );
  }, [payment, queryClient, status]);

  async function copyPixCode() {
    if (!payment?.copyPasteCode) return;
    await Clipboard.setStringAsync(payment.copyPasteCode);
    setCopyFeedback("Código PIX copiado.");
    setTimeout(() => setCopyFeedback(null), 2_000);
  }

  if (!paymentId || !payment) {
    return (
      <QueryStateView
        actionLabel="Voltar para recarga"
        message="Os dados deste PIX não estão mais disponíveis. Gere um novo pagamento."
        onAction={() => router.replace("/main/recharge")}
        title="Pagamento não encontrado"
      />
    );
  }

  if (status === "approved") {
    return (
      <Screen>
        <PageHeader title="Pagamento" onBack={() => router.back()} />
        <ResultContent>
          <ResultIcon failure={false}>
            <IconSymbol color="success" name="checkmark" size={72} />
          </ResultIcon>
          <ResultTitle>Recarga confirmada!</ResultTitle>
          <ResultDescription>
            Você adicionou {formatCurrency(payment.amount)} em créditos.
          </ResultDescription>
          {homeSummaryQuery.data ? (
            <BalanceCard>
              <BalanceLabel>Saldo disponível</BalanceLabel>
              <BalanceValue>{formatCurrency(homeSummaryQuery.data.balance)}</BalanceValue>
            </BalanceCard>
          ) : null}
          <ResultActions>
            <AppButton label="Voltar ao início" onPress={() => router.replace("/main/home")} />
          </ResultActions>
        </ResultContent>
      </Screen>
    );
  }

  if (status !== "pending") {
    const failureCopy = getFailureCopy(status);
    return (
      <Screen>
        <PageHeader title="Pagamento" onBack={() => router.back()} />
        <ResultContent>
          <ResultIcon failure>
            <IconSymbol color="warning" name="exclamationmark" size={72} />
          </ResultIcon>
          <ResultTitle>{failureCopy.title}</ResultTitle>
          <ResultDescription>{failureCopy.description}</ResultDescription>
          <ResultActions>
            <AppButton
              label="Gerar novo PIX"
              onPress={() => router.replace("/main/recharge")}
            />
            <AppButton
              label="Voltar ao início"
              onPress={() => router.replace("/main/home")}
              variant="outlined"
            />
          </ResultActions>
        </ResultContent>
      </Screen>
    );
  }

  return (
    <ScrollScreen>
      <PageHeader title="Pagamento" onBack={() => router.back()} />
      <ScreenContent>
        <PaymentContent>
          <AmountText>{formatCurrency(payment.amount)}</AmountText>
          <WaitingBadge>
            <WaitingText>Aguardando pagamento…</WaitingText>
          </WaitingBadge>
          <PaymentDescription>A confirmação é automática.</PaymentDescription>
          <QrCard>
            {payment.qrCodeUri ? (
              <QrImage
                accessibilityIgnoresInvertColors
                accessibilityLabel="QR Code para pagamento via PIX"
                resizeMode="contain"
                source={{ uri: payment.qrCodeUri }}
              />
            ) : (
              <QrUnavailable>
                <PaymentDescription>QR Code indisponível.</PaymentDescription>
              </QrUnavailable>
            )}
            <PixInstruction>
              Escaneie o QR Code ou copie o código abaixo
            </PixInstruction>
            <CodeBox>
              <CodeText numberOfLines={1}>{payment.copyPasteCode}</CodeText>
              <IconButton
                accessibilityLabel="Copiar código PIX"
                iconColor="primary"
                name="doc.on.doc"
                onPress={copyPixCode}
              />
            </CodeBox>
            {copyFeedback ? (
              <CopyFeedback accessibilityLiveRegion="polite">
                {copyFeedback}
              </CopyFeedback>
            ) : null}
          </QrCard>
          {statusQuery.isError ? (
            <PaymentError>
              <PaymentErrorText>
                Não foi possível consultar o pagamento. A nova tentativa será feita ao
                tocar no botão abaixo.
              </PaymentErrorText>
              <AppButton
                label="Consultar novamente"
                onPress={() => statusQuery.refetch()}
                variant="outlined"
              />
            </PaymentError>
          ) : null}
          <FooterInfo>
            <Expiration>
              {remainingSeconds > 0
                ? `Expira em ${formatCountdown(remainingSeconds)}`
                : "Tempo local esgotado"}
            </Expiration>
            <Hint>Não feche esta tela até a confirmação.</Hint>
          </FooterInfo>
        </PaymentContent>
      </ScreenContent>
    </ScrollScreen>
  );
}
