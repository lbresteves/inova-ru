import { useRouter } from "expo-router";
import { useMemo, useState } from "react";

import { getApiErrorMessage } from "@shared/api";
import { AppButton, HeaderBack } from "@shared/components";
import { useCreatePaymentMutation } from "../hooks/useCreatePaymentMutation";
import { useCreditAccountQuery } from "@features/CreditAccount";
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
  const accountQuery = useCreditAccountQuery();
  const balance = accountQuery.data?.balance;
  const canRecharge = accountQuery.data?.permissions.canRecharge !== false;
  const createPaymentMutation = useCreatePaymentMutation();
  const [selectedPreset, setSelectedPreset] =
    useState<RechargePreset | null>(50);
  const [digits, setDigits] = useState("5000");

  const formattedValue = formatCurrencyInput(digits);
  const amount = currencyInputToNumber(formattedValue);
  const validationError = useMemo(
    () => validateRechargeAmount(amount, balance),
    [amount, balance],
  );

  const requestError = createPaymentMutation.isError
    ? getApiErrorMessage(createPaymentMutation.error)
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
      !balance || !canRecharge
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
              <HintText>
                Mínimo R$ 5,00 · Máximo {formatCurrency(
                  balance?.maxRechargeAmount ?? 500,
                )}
              </HintText>
            )}
          </Section>

          <Notice>
            <NoticeText>
              {`O valor máximo permitido por recarga é ${formatCurrency(
                balance?.maxRechargeAmount ?? 500,
              )}.`}
            </NoticeText>
          </Notice>

          {accountQuery.data ? (
            <BalanceText>
              Saldo atual: {formatCurrency(accountQuery.data.balance.current)}
            </BalanceText>
          ) : accountQuery.isError ? (
            <ErrorText>{getApiErrorMessage(accountQuery.error)}</ErrorText>
          ) : (
            <BalanceText>Consultando saldo atual...</BalanceText>
          )}
          {!canRecharge ? (
            <ErrorText>Recargas estão indisponíveis para este consumidor.</ErrorText>
          ) : null}
          {requestError ? <ErrorText>{requestError}</ErrorText> : null}
          <ButtonArea>
            <AppButton
              disabled={Boolean(validationError) || !balance || !canRecharge}
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
