import {
  AppInput,
  HeaderBack,
  SelectableBox,
  TimeWheelInput,
  Toggle,
  type TimeWheelValue,
} from "@shared/components";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { useBalanceMonitorNotifications } from "../hooks/useBalanceMonitorNotifications";
import {
  type CreditReminderWeekDay,
  useCreditReminderNotifications,
} from "../hooks/useCreditReminderNotifications";
import {
  Container,
  Content,
  NotificationNotice,
  NotificationNoticeButton,
  NotificationNoticeButtonText,
  NotificationNoticeText,
  NotificationSubsection,
  OptionRow,
  ScheduleLabel,
  ScheduleRow,
  Section,
  SectionTitle,
  SettingLabel,
  SettingRow,
  WeekDayRow,
} from "./styles/ConfigurationScreen.styled";

const amountOptions: number[] = [10, 20, 50, 100];

interface WeekDayOption {
  accessibilityLabel: string;
  label: string;
  value: CreditReminderWeekDay;
}

const weekDays: WeekDayOption[] = [
  { accessibilityLabel: "domingo", label: "D", value: "sunday" },
  { accessibilityLabel: "segunda-feira", label: "S", value: "monday" },
  { accessibilityLabel: "terça-feira", label: "T", value: "tuesday" },
  { accessibilityLabel: "quarta-feira", label: "Q", value: "wednesday" },
  { accessibilityLabel: "quinta-feira", label: "Q", value: "thursday" },
  { accessibilityLabel: "sexta-feira", label: "S", value: "friday" },
  { accessibilityLabel: "sábado", label: "S", value: "saturday" },
];

function formatCurrencyInput(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function formatAmountOption(value: number): string {
  return `R$ ${value}`;
}

function parseCurrencyInput(value: string): number | null {
  const numericText = value.replace(/[^\d,.]/g, "");

  if (!numericText) {
    return null;
  }

  const normalizedText = numericText.includes(",")
    ? numericText.replace(/\./g, "").replace(",", ".")
    : numericText;
  const parsedValue = Number(normalizedText);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return null;
  }

  return Math.round(parsedValue * 100) / 100;
}

export function ConfigurationScreen() {
  const router = useRouter();
  const {
    canAskPermissionAgain: canAskBalancePermissionAgain,
    configuration: balanceMonitorConfiguration,
    isLoading: isBalanceMonitorLoading,
    isSaving: isBalanceMonitorSaving,
    openNotificationSettings: openBalanceNotificationSettings,
    permissionStatus: balancePermissionStatus,
    retryPermissionRequest: retryBalancePermissionRequest,
    syncStatus: balanceMonitorSyncStatus,
    updateEnabled: updateBalanceMonitorEnabled,
    updateMinimumBalance: updateBalanceMonitorMinimumBalance,
  } = useBalanceMonitorNotifications();
  const {
    canAskPermissionAgain,
    configuration: creditReminderConfiguration,
    isLoading: isCreditReminderLoading,
    isSaving: isCreditReminderSaving,
    openNotificationSettings,
    permissionStatus,
    retryPermissionRequest,
    syncStatus,
    updateEnabled: updateCreditReminderEnabled,
    updateTime: updateCreditReminderTime,
    updateWeekDays: updateCreditReminderWeekDays,
  } = useCreditReminderNotifications();
  const [generalNotificationsEnabled, setGeneralNotificationsEnabled] =
    useState<boolean>(true);
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>(
    formatCurrencyInput(50)
  );

  const weeklyReminderDisabled =
    !generalNotificationsEnabled || isCreditReminderLoading;
  const balanceMonitorDisabled =
    !generalNotificationsEnabled || isBalanceMonitorLoading;
  const weeklyReminderControlsDisabled =
    weeklyReminderDisabled || !creditReminderConfiguration.enabled;
  const balanceMonitorControlsDisabled =
    balanceMonitorDisabled || !balanceMonitorConfiguration.enabled;
  const shouldShowPermissionNotice =
    generalNotificationsEnabled &&
    creditReminderConfiguration.enabled &&
    permissionStatus === "denied";
  const shouldShowScheduleErrorNotice =
    generalNotificationsEnabled &&
    creditReminderConfiguration.enabled &&
    syncStatus === "schedule-error";
  const shouldShowBalancePermissionNotice =
    generalNotificationsEnabled &&
    balanceMonitorConfiguration.enabled &&
    balancePermissionStatus === "denied";
  const shouldShowBalanceTaskErrorNotice =
    generalNotificationsEnabled &&
    balanceMonitorConfiguration.enabled &&
    (balanceMonitorSyncStatus === "task-error" ||
      balanceMonitorSyncStatus === "task-unavailable");
  const shouldShowStorageErrorNotice =
    syncStatus === "storage-error" ||
    balanceMonitorSyncStatus === "storage-error";
  const permissionNoticeText = canAskPermissionAgain
    ? "Permissão de notificação negada. Tente novamente para agendar seus lembretes."
    : "Permissão de notificação bloqueada. Ative as notificações nas configurações do app.";
  const permissionNoticeActionText = canAskPermissionAgain
    ? "Tentar novamente"
    : "Abrir configurações";

  const balancePermissionNoticeText = canAskBalancePermissionAgain
    ? "Permissão de notificação negada. Tente novamente para ativar o alerta de saldo baixo."
    : "Permissão de notificação bloqueada. Ative as notificações nas configurações do app.";
  const balancePermissionNoticeActionText = canAskBalancePermissionAgain
    ? "Tentar novamente"
    : "Abrir configurações";

  useEffect(() => {
    if (isBalanceMonitorLoading) {
      return;
    }

    const minimumBalance = balanceMonitorConfiguration.minimumBalance;
    const knownAmount = amountOptions.find(
      (amount) => amount === minimumBalance
    );

    setSelectedAmount(knownAmount ?? 0);
    setCustomAmount(formatCurrencyInput(minimumBalance));
  }, [
    balanceMonitorConfiguration.minimumBalance,
    isBalanceMonitorLoading,
  ]);

  function handleAmountPress(value: number): void {
    setSelectedAmount(value);
    setCustomAmount(formatCurrencyInput(value));
    void updateBalanceMonitorMinimumBalance(value);
  }

  function handleCustomAmountChange(value: string): void {
    setSelectedAmount(0);
    setCustomAmount(value);

    const parsedValue = parseCurrencyInput(value);

    if (parsedValue !== null) {
      void updateBalanceMonitorMinimumBalance(parsedValue);
    }
  }

  function handleGeneralNotificationsChange(value: boolean): void {
    setGeneralNotificationsEnabled(value);

    if (!value) {
      void updateCreditReminderEnabled(false);
      void updateBalanceMonitorEnabled(false);
    }
  }

  function handleBalanceMonitorEnabledChange(value: boolean): void {
    const parsedCustomAmount = parseCurrencyInput(customAmount);
    const minimumBalance =
      parsedCustomAmount ?? balanceMonitorConfiguration.minimumBalance;

    void updateBalanceMonitorEnabled(value, minimumBalance);
  }

  function handleCreditReminderEnabledChange(value: boolean): void {
    void updateCreditReminderEnabled(value);
  }

  function handleCreditReminderWeekDaysChange(
    values: CreditReminderWeekDay[]
  ): void {
    void updateCreditReminderWeekDays(values);
  }

  function handleCreditReminderTimeChange(value: TimeWheelValue): void {
    void updateCreditReminderTime(value);
  }

  function handleNotificationPermissionActionPress(): void {
    if (canAskPermissionAgain) {
      void retryPermissionRequest();
      return;
    }

    void openNotificationSettings();
  }

  function handleBalancePermissionActionPress(): void {
    if (canAskBalancePermissionAgain) {
      void retryBalancePermissionRequest();
      return;
    }

    void openBalanceNotificationSettings();
  }

  return (
    <Container contentContainerStyle={{ flexGrow: 1 }}>
      <Content>
        <HeaderBack title="Configurações" onReturnPress={() => router.back()} />

        <Section>
          <SectionTitle>Notificações</SectionTitle>

          <SettingRow>
            <Toggle
              accessibilityLabel="Habilitar notificações gerais"
              value={generalNotificationsEnabled}
              onValueChange={handleGeneralNotificationsChange}
            />
            <SettingLabel>Habilitar notificações gerais</SettingLabel>
          </SettingRow>

          <NotificationSubsection>
            <SettingRow>
              <Toggle
                accessibilityLabel="Notificar quando saldo abaixo de"
                disabled={balanceMonitorDisabled}
                value={balanceMonitorConfiguration.enabled}
                onValueChange={handleBalanceMonitorEnabledChange}
              />
              <SettingLabel>Notificar quando saldo abaixo de</SettingLabel>
            </SettingRow>

            <OptionRow>
              {amountOptions.map((amount) => (
                <SelectableBox
                  key={amount}
                  accessibilityLabel={`Saldo abaixo de ${formatAmountOption(
                    amount
                  )}`}
                  disabled={balanceMonitorControlsDisabled}
                  label={formatAmountOption(amount)}
                  selected={selectedAmount === amount}
                  value={amount}
                  onPress={handleAmountPress}
                />
              ))}
            </OptionRow>

            <AppInput
              isStrong
              accessibilityLabel="Digite outro valor"
              keyboardType="decimal-pad"
              label="Ou digite outro valor"
              editable={!balanceMonitorControlsDisabled}
              value={customAmount}
              onChangeText={handleCustomAmountChange}
            />

            {shouldShowBalancePermissionNotice ? (
              <NotificationNotice accessibilityRole="alert">
                <NotificationNoticeText>
                  {balancePermissionNoticeText}
                </NotificationNoticeText>
                <NotificationNoticeButton
                  accessibilityLabel={balancePermissionNoticeActionText}
                  accessibilityRole="button"
                  disabled={isBalanceMonitorSaving}
                  onPress={handleBalancePermissionActionPress}
                >
                  <NotificationNoticeButtonText>
                    {balancePermissionNoticeActionText}
                  </NotificationNoticeButtonText>
                </NotificationNoticeButton>
              </NotificationNotice>
            ) : null}

            {shouldShowBalanceTaskErrorNotice ? (
              <NotificationNotice accessibilityRole="alert">
                <NotificationNoticeText>
                  Não foi possível ativar o monitoramento em segundo plano neste
                  build. Refaça o dev build e tente novamente.
                </NotificationNoticeText>
              </NotificationNotice>
            ) : null}

            <SettingRow>
              <Toggle
                accessibilityLabel="Notificar semanalmente"
                disabled={weeklyReminderDisabled}
                value={creditReminderConfiguration.enabled}
                onValueChange={handleCreditReminderEnabledChange}
              />
              <SettingLabel>Notificar semanalmente</SettingLabel>
            </SettingRow>

            {shouldShowPermissionNotice ? (
              <NotificationNotice accessibilityRole="alert">
                <NotificationNoticeText>
                  {permissionNoticeText}
                </NotificationNoticeText>
                <NotificationNoticeButton
                  accessibilityLabel={permissionNoticeActionText}
                  accessibilityRole="button"
                  disabled={isCreditReminderSaving}
                  onPress={handleNotificationPermissionActionPress}
                >
                  <NotificationNoticeButtonText>
                    {permissionNoticeActionText}
                  </NotificationNoticeButtonText>
                </NotificationNoticeButton>
              </NotificationNotice>
            ) : null}

            {shouldShowScheduleErrorNotice ? (
              <NotificationNotice accessibilityRole="alert">
                <NotificationNoticeText>
                  Não foi possível agendar o lembrete. Verifique as permissões
                  do app e tente novamente.
                </NotificationNoticeText>
              </NotificationNotice>
            ) : null}

            {shouldShowStorageErrorNotice ? (
              <NotificationNotice accessibilityRole="alert">
                <NotificationNoticeText>
                  Não foi possível carregar sua configuração de lembrete.
                </NotificationNoticeText>
              </NotificationNotice>
            ) : null}

            <WeekDayRow>
              {weekDays.map((day) => (
                <SelectableBox
                  key={day.value}
                  accessibilityLabel={`Selecionar ${day.accessibilityLabel}`}
                  disabled={weeklyReminderControlsDisabled}
                  label={day.label}
                  minWidth={34}
                  selectedValues={creditReminderConfiguration.weekDays}
                  value={day.value}
                  onSelectedValuesChange={handleCreditReminderWeekDaysChange}
                />
              ))}
            </WeekDayRow>

            <ScheduleRow>
              <ScheduleLabel>Horário:</ScheduleLabel>
              <TimeWheelInput
                disabled={weeklyReminderControlsDisabled}
                value={creditReminderConfiguration.time}
                onChange={handleCreditReminderTimeChange}
              />
            </ScheduleRow>
          </NotificationSubsection>
        </Section>
      </Content>
    </Container>
  );
}
