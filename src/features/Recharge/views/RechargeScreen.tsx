import { useRouter } from "expo-router";
import { useMemo, useState } from "react";

import { ApiError } from "@shared/api";
import { AppButton, HeaderBack } from "@shared/components";
import { useCreatePaymentMutation } from "../hooks/useCreatePaymentMutation";
import { useRechargeBalanceQuery } from "../hooks/useRechargeBalanceQuery";
import type { RechargePreset } from "../types/Recharge";
import {
  currencyInputToNumber,
  formatCurrency,
  formatCurrencyInput,
  onlyCurrencyDigits,
} from "../utils/currency";
import { validateRechargeAmount } from "../utils/rechargeValidation";
import { CurrencyField } from "./components/CurrencyField";
import { RechargePresetChip } from "./components/RechargePresetChip";
import {
  BalanceText,
  ButtonArea,
  ChipsRow,
  Content,
  ErrorText,
  HintText,
  Notice,
  NoticeText,
  Screen,
  Scroll,
  Section,
  SectionLabel,
} from "./styles/RechargeScreen.styled";

const PRESETS: RechargePreset[] = [10, 20, 50, 100];

export default function RechargeScreen() {
  const router = useRouter();
  const balanceQuery = useRechargeBalanceQuery();
  const createPaymentMutation = useCreatePaymentMutation();
  const [selectedPreset, setSelectedPreset] =
    useState<RechargePreset | null>(50);
  const [digits, setDigits] = useState("5000");

  const formattedValue = formatCurrencyInput(digits);
  const amount = currencyInputToNumber(formattedValue);
  const validationError = useMemo(
    () => validateRechargeAmount(amount, balanceQuery.data),
    [amount, balanceQuery.data],
  );

  const requestError =
    createPaymentMutation.error instanceof ApiError
      ? createPaymentMutation.error.message
      : createPaymentMutation.isError
        ? "Não foi possível gerar o PIX. Tente novamente."
        : undefined;

  function selectPreset(value: RechargePreset) {
    setSelectedPreset(value);
    setDigits(String(value * 100));
    createPaymentMutation.reset();
  }

  async function createPayment() {
    if (
      createPaymentMutation.isPending ||
      validationError ||
      !balanceQuery.data
    ) {
      return;
    }

    try {
      const payment = await createPaymentMutation.mutateAsync(amount);
      router.push({
        pathname: "/main/recharge/payment",
        params: { paymentId: payment.id },
      });
    } catch {
      // The request error is rendered below the form.
    }
  }

  return (
    <Screen>
      <HeaderBack title="Recarregar" onReturnPress={() => router.back()} />
      <Scroll
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Content>
          <Section>
            <SectionLabel>Escolha um valor</SectionLabel>
            <ChipsRow>
              {PRESETS.map((value) => (
                <RechargePresetChip
                  key={value}
                  label={`R$ ${value}`}
                  onPress={() => selectPreset(value)}
                  selected={selectedPreset === value}
                />
              ))}
            </ChipsRow>
          </Section>

          <Section>
            <SectionLabel>Ou digite outro valor</SectionLabel>
            <CurrencyField
              errorText={validationError}
              onChangeText={(value) => {
                setDigits(onlyCurrencyDigits(value));
                setSelectedPreset(null);
                createPaymentMutation.reset();
              }}
              value={formattedValue}
            />
            {validationError ? (
              <ErrorText>{validationError}</ErrorText>
            ) : (
              <HintText>Mínimo R$ 5,00 · Máximo R$ 500,00</HintText>
            )}
          </Section>

          <Notice>
            <NoticeText>
              {`O saldo após a recarga não pode ultrapassar o limite de ${formatCurrency(
                balanceQuery.data?.limit ?? 500,
              )}.`}
            </NoticeText>
          </Notice>

          {balanceQuery.data ? (
            <BalanceText>
              Saldo atual: {formatCurrency(balanceQuery.data.current)}
            </BalanceText>
          ) : balanceQuery.isError ? (
            <ErrorText>
              Não foi possível consultar o saldo. Reabra esta tela para tentar
              novamente.
            </ErrorText>
          ) : (
            <BalanceText>Consultando saldo atual...</BalanceText>
          )}
          {requestError ? <ErrorText>{requestError}</ErrorText> : null}
          <ButtonArea>
            <AppButton
              disabled={Boolean(validationError) || !balanceQuery.data}
              label="Gerar PIX"
              loading={createPaymentMutation.isPending}
              onPress={() => void createPayment()}
            />
          </ButtonArea>
        </Content>
      </Scroll>
    </Screen>
  );
}
