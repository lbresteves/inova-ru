import {
  AppInput,
  HeaderBack,
  SelectableBox,
  TimeWheelInput,
  Toggle,
  type TimeWheelValue,
} from "@shared/components";
import { useRouter } from "expo-router";
import { useState } from "react";

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

export function ConfigurationScreen() {
  const router = useRouter();
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
  const [balanceNotificationEnabled, setBalanceNotificationEnabled] =
    useState<boolean>(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>(
    formatCurrencyInput(50)
  );

  const weeklyReminderDisabled =
    !generalNotificationsEnabled || isCreditReminderLoading;
  const weeklyReminderControlsDisabled =
    weeklyReminderDisabled || !creditReminderConfiguration.enabled;
  const shouldShowPermissionNotice =
    generalNotificationsEnabled &&
    creditReminderConfiguration.enabled &&
    permissionStatus === "denied";
  const shouldShowScheduleErrorNotice =
    generalNotificationsEnabled &&
    creditReminderConfiguration.enabled &&
    syncStatus === "schedule-error";
  const shouldShowStorageErrorNotice = syncStatus === "storage-error";
  const permissionNoticeText = canAskPermissionAgain
    ? "Permissão de notificação negada. Tente novamente para agendar seus lembretes."
    : "Permissão de notificação bloqueada. Ative as notificações nas configurações do app.";
  const permissionNoticeActionText = canAskPermissionAgain
    ? "Tentar novamente"
    : "Abrir configurações";

  function handleAmountPress(value: number): void {
    setSelectedAmount(value);
    setCustomAmount(formatCurrencyInput(value));
  }

  function handleCustomAmountChange(value: string): void {
    setSelectedAmount(0);
    setCustomAmount(value);
  }

  function handleGeneralNotificationsChange(value: boolean): void {
    setGeneralNotificationsEnabled(value);

    if (!value) {
      setBalanceNotificationEnabled(false);
      void updateCreditReminderEnabled(false);
    }
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
                disabled={!generalNotificationsEnabled}
                value={balanceNotificationEnabled}
                onValueChange={setBalanceNotificationEnabled}
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
                  disabled={!generalNotificationsEnabled}
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
              value={customAmount}
              onChangeText={handleCustomAmountChange}
            />

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
