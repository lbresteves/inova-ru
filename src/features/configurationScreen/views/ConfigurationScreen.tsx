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
  Container,
  Content,
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

const amountOptions = [10, 20, 50, 100];

const weekDays = [
  { accessibilityLabel: "domingo", label: "D", value: "sunday" },
  { accessibilityLabel: "segunda-feira", label: "S", value: "monday" },
  { accessibilityLabel: "terça-feira", label: "T", value: "tuesday" },
  { accessibilityLabel: "quarta-feira", label: "Q", value: "wednesday" },
  { accessibilityLabel: "quinta-feira", label: "Q", value: "thursday" },
  { accessibilityLabel: "sexta-feira", label: "S", value: "friday" },
  { accessibilityLabel: "sábado", label: "S", value: "saturday" },
];

function formatCurrencyInput(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function formatAmountOption(value: number) {
  return `R$ ${value}`;
}

export function ConfigurationScreen() {
  const router = useRouter();
  const [generalNotificationsEnabled, setGeneralNotificationsEnabled] =
    useState(true);
  const [balanceNotificationEnabled, setBalanceNotificationEnabled] =
    useState(false);
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState(formatCurrencyInput(50));
  const [weeklyNotificationEnabled, setWeeklyNotificationEnabled] =
    useState(true);
  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>([]);
  const [notificationTime, setNotificationTime] = useState<TimeWheelValue>({
    hour: 10,
    minute: 30,
  });

  function handleAmountPress(value: number) {
    setSelectedAmount(value);
    setCustomAmount(formatCurrencyInput(value));
  }

  function handleCustomAmountChange(value: string) {
    setSelectedAmount(0);
    setCustomAmount(value);
  }

  function handleGeneralNotificationsChange(value: boolean) {
    setGeneralNotificationsEnabled(value);

    if (!value) {
      setBalanceNotificationEnabled(false);
      setWeeklyNotificationEnabled(false);
    }
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
                disabled={!generalNotificationsEnabled}
                value={weeklyNotificationEnabled}
                onValueChange={setWeeklyNotificationEnabled}
              />
              <SettingLabel>Notificar semanalmente</SettingLabel>
            </SettingRow>

            <WeekDayRow>
              {weekDays.map((day) => (
                <SelectableBox
                  key={day.value}
                  accessibilityLabel={`Selecionar ${day.accessibilityLabel}`}
                  disabled={!generalNotificationsEnabled}
                  label={day.label}
                  minWidth={34}
                  selectedValues={selectedWeekDays}
                  value={day.value}
                  onSelectedValuesChange={setSelectedWeekDays}
                />
              ))}
            </WeekDayRow>

            <ScheduleRow>
              <ScheduleLabel>Horário:</ScheduleLabel>
              <TimeWheelInput
                value={notificationTime}
                onChange={setNotificationTime}
              />
            </ScheduleRow>
          </NotificationSubsection>
        </Section>
      </Content>
    </Container>
  );
}
