import { ApiError } from "@shared/api";
import {
  AppButton,
  PageHeader,
  ScreenContent,
  ScrollScreen,
  SelectChip,
  TextField,
} from "@shared/components";
import { useHomeSummaryQuery } from "@features/Home";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useCreatePaymentMutation } from "../hooks/useCreatePaymentMutation";
import type { RechargePreset } from "../types/Recharge";
import {
  currencyInputToNumber,
  formatCurrencyInput,
  onlyCurrencyDigits,
} from "../utils/currency";
import {
  BottomButton,
  ChipsRow,
  FormContent,
  Notice,
  NoticeText,
  Section,
  SectionLabel,
  ServerErrorText,
} from "./styles/RechargeShared.styled";

const presets: RechargePreset[] = [10, 20, 50, 100];

export default function RechargeScreen() {
  const router = useRouter();
  const homeSummaryQuery = useHomeSummaryQuery();
  const createPaymentMutation = useCreatePaymentMutation();
  const [selected, setSelected] = useState<RechargePreset | null>(50);
  const [digits, setDigits] = useState("5000");
  const formatted = formatCurrencyInput(digits);
  const amount = currencyInputToNumber(formatted);
  const currentBalance = homeSummaryQuery.data?.balance ?? 0;
  const rechargeLimit = homeSummaryQuery.data?.rechargeLimit ?? 500;
  const error = useMemo(() => {
    if (amount < 5) return "O valor mínimo para recarga é R$ 5,00.";
    if (amount > 500) return "O valor máximo para recarga é R$ 500,00.";
    if (currentBalance + amount > rechargeLimit) {
      return `O saldo após a recarga não pode ultrapassar R$ ${rechargeLimit.toFixed(2).replace(".", ",")}.`;
    }
    return undefined;
  }, [amount, currentBalance, rechargeLimit]);

  function choosePreset(value: RechargePreset) {
    setSelected(value);
    setDigits(String(value * 100));
    createPaymentMutation.reset();
  }

  async function createPayment() {
    if (error || amount === 0) return;
    try {
      const payment = await createPaymentMutation.mutateAsync(amount);
      router.push({
        pathname: "/recharge/payment",
        params: { paymentId: payment.id },
      });
    } catch {
      // The mutation error is rendered below the form.
    }
  }

  const serverError =
    createPaymentMutation.error instanceof ApiError
      ? createPaymentMutation.error.message
      : createPaymentMutation.isError
        ? "Não foi possível gerar o PIX."
        : undefined;

  return (
    <ScrollScreen>
      <PageHeader title="Recarregar" onBack={() => router.back()} />
      <ScreenContent>
        <FormContent>
          <Section>
            <SectionLabel>Escolha um valor</SectionLabel>
            <ChipsRow>
              {presets.map((value) => (
                <SelectChip
                  accessibilityLabel={`Selecionar R$ ${value}`}
                  key={value}
                  label={`R$ ${value}`}
                  onPress={() => choosePreset(value)}
                  selected={selected === value}
                />
              ))}
            </ChipsRow>
          </Section>

          <Section>
            <SectionLabel>Ou digite outro valor</SectionLabel>
            <TextField
              accessibilityLabel="Valor da recarga"
              errorText={error}
              keyboardType="number-pad"
              onChangeText={(value) => {
                const nextDigits = onlyCurrencyDigits(value);
                setDigits(nextDigits);
                setSelected(null);
                createPaymentMutation.reset();
              }}
              prefix="R$"
              value={formatted}
            />
            {!error ? (
              <SectionLabel>Mínimo R$ 5,00 · Máximo R$ 500,00</SectionLabel>
            ) : null}
          </Section>

          <Notice>
            <NoticeText>
              O saldo após a recarga não pode ultrapassar o limite de R$ 500,00.
            </NoticeText>
          </Notice>

          {serverError ? (
            <ServerErrorText accessibilityLiveRegion="polite">
              {serverError}
            </ServerErrorText>
          ) : null}

          <BottomButton>
            <AppButton
              disabled={Boolean(error) || amount === 0}
              label="Gerar PIX"
              loading={createPaymentMutation.isPending}
              onPress={createPayment}
            />
          </BottomButton>
        </FormContent>
      </ScreenContent>
    </ScrollScreen>
  );
}
