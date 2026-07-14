import { useTheme } from "@emotion/react";
import {
  PageHeader,
  ScreenContent,
  ScrollScreen,
  SelectChip,
  SelectionModal,
  TextField,
} from "@shared/components";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Switch } from "react-native";
import type { NotificationSettings, Weekday } from "../types/NotificationSettings";
import {
  DayButton,
  DayText,
  HelperText,
  ScreenHeading,
  SettingBlock,
  SettingLabel,
  SettingRow,
  SettingsContent,
  Subsection,
  Thresholds,
  TimeButton,
  TimeText,
  Weekdays,
} from "./styles/SettingsScreen.styled";

const thresholdOptions = [10, 20, 50, 100];
const reminderTimes = ["10:00", "12:00", "15:00", "18:00", "20:00"] as const;
const weekdays: { key: Weekday; label: string; name: string }[] = [
  { key: "D", label: "D", name: "Domingo" },
  { key: "S1", label: "S", name: "Segunda-feira" },
  { key: "T", label: "T", name: "Terça-feira" },
  { key: "Q1", label: "Q", name: "Quarta-feira" },
  { key: "Q2", label: "Q", name: "Quinta-feira" },
  { key: "S2", label: "S", name: "Sexta-feira" },
  { key: "S3", label: "S", name: "Sábado" },
];

const initialSettings: NotificationSettings = {
  notificationsEnabled: true,
  lowBalanceEnabled: false,
  lowBalanceThreshold: 50,
  weeklyReminderEnabled: true,
  reminderDays: ["Q1"],
  reminderTime: "10:00",
};

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [settings, setSettings] = useState(initialSettings);
  const [customThreshold, setCustomThreshold] = useState("50,00");
  const [timeModalVisible, setTimeModalVisible] = useState(false);

  const notificationChildrenEnabled = settings.notificationsEnabled;
  const lowBalanceConfigurationEnabled =
    settings.notificationsEnabled && settings.lowBalanceEnabled;
  const weeklyConfigurationEnabled =
    settings.notificationsEnabled && settings.weeklyReminderEnabled;

  function toggleDay(day: Weekday) {
    if (!weeklyConfigurationEnabled) return;
    setSettings((current) => ({
      ...current,
      reminderDays: current.reminderDays.includes(day)
        ? current.reminderDays.filter((item) => item !== day)
        : [...current.reminderDays, day],
    }));
  }

  const switchColors = {
    false: theme.colors.disabledContent,
    true: theme.colors.primary,
  };

  return (
    <ScrollScreen>
      <PageHeader title="Configurações" onBack={() => router.back()} />
      <ScreenContent>
        <SettingsContent>
          <ScreenHeading>Notificações</ScreenHeading>
          <SettingBlock>
            <SettingRow>
              <Switch
                accessibilityLabel="Ativar notificações"
                accessibilityRole="switch"
                ios_backgroundColor={theme.colors.disabledContent}
                onValueChange={(notificationsEnabled) =>
                  setSettings((current) => ({ ...current, notificationsEnabled }))
                }
                thumbColor={theme.colors.surfaceElevated}
                trackColor={switchColors}
                value={settings.notificationsEnabled}
              />
              <SettingLabel>Ativar notificações</SettingLabel>
            </SettingRow>
          </SettingBlock>

          <SettingBlock disabled={!notificationChildrenEnabled}>
            <SettingRow>
              <Switch
                accessibilityLabel="Avisar quando o saldo estiver baixo"
                accessibilityRole="switch"
                disabled={!notificationChildrenEnabled}
                ios_backgroundColor={theme.colors.disabledContent}
                onValueChange={(lowBalanceEnabled) =>
                  setSettings((current) => ({ ...current, lowBalanceEnabled }))
                }
                thumbColor={theme.colors.surfaceElevated}
                trackColor={switchColors}
                value={settings.lowBalanceEnabled}
              />
              <SettingLabel disabled={!notificationChildrenEnabled}>
                Avisar quando o saldo estiver baixo
              </SettingLabel>
            </SettingRow>
            <Subsection disabled={!lowBalanceConfigurationEnabled}>
              <Thresholds>
                {thresholdOptions.map((value) => (
                  <SelectChip
                    disabled={!lowBalanceConfigurationEnabled}
                    key={value}
                    label={`R$ ${value}`}
                    onPress={() => {
                      setSettings((current) => ({ ...current, lowBalanceThreshold: value }));
                      setCustomThreshold(`${value},00`);
                    }}
                    selected={settings.lowBalanceThreshold === value}
                  />
                ))}
              </Thresholds>
              <TextField
                accessibilityLabel="Outro valor para saldo baixo"
                editable={lowBalanceConfigurationEnabled}
                keyboardType="decimal-pad"
                label="Ou digite outro valor"
                onChangeText={(value) => {
                  setCustomThreshold(value);
                  const parsed = Number(value.replace(",", "."));
                  if (Number.isFinite(parsed)) {
                    setSettings((current) => ({ ...current, lowBalanceThreshold: parsed }));
                  }
                }}
                prefix="R$"
                value={customThreshold}
              />
            </Subsection>
          </SettingBlock>

          <SettingBlock disabled={!notificationChildrenEnabled}>
            <SettingRow>
              <Switch
                accessibilityLabel="Ativar lembrete semanal"
                accessibilityRole="switch"
                disabled={!notificationChildrenEnabled}
                ios_backgroundColor={theme.colors.disabledContent}
                onValueChange={(weeklyReminderEnabled) =>
                  setSettings((current) => ({ ...current, weeklyReminderEnabled }))
                }
                thumbColor={theme.colors.surfaceElevated}
                trackColor={switchColors}
                value={settings.weeklyReminderEnabled}
              />
              <SettingLabel disabled={!notificationChildrenEnabled}>
                Lembrete semanal de recarga
              </SettingLabel>
            </SettingRow>
            <Subsection disabled={!weeklyConfigurationEnabled}>
              <HelperText>Escolha os dias</HelperText>
              <Weekdays>
                {weekdays.map((day) => {
                  const selected = settings.reminderDays.includes(day.key);
                  return (
                    <DayButton
                      accessibilityLabel={day.name}
                      accessibilityRole="button"
                      accessibilityState={{
                        disabled: !weeklyConfigurationEnabled,
                        selected,
                      }}
                      disabled={!weeklyConfigurationEnabled}
                      key={day.key}
                      onPress={() => toggleDay(day.key)}
                      selected={selected}
                    >
                      <DayText
                        disabled={!weeklyConfigurationEnabled}
                        selected={selected}
                      >
                        {day.label}
                      </DayText>
                    </DayButton>
                  );
                })}
              </Weekdays>
              <HelperText>Horário</HelperText>
              <TimeButton
                accessibilityLabel="Alterar horário"
                accessibilityRole="button"
                accessibilityState={{ disabled: !weeklyConfigurationEnabled }}
                disabled={!weeklyConfigurationEnabled}
                onPress={() => setTimeModalVisible(true)}
              >
                <TimeText disabled={!weeklyConfigurationEnabled}>
                  {settings.reminderTime}
                </TimeText>
              </TimeButton>
            </Subsection>
          </SettingBlock>
        </SettingsContent>
      </ScreenContent>

      <SelectionModal
        onClose={() => setTimeModalVisible(false)}
        onSelect={(reminderTime) =>
          setSettings((current) => ({ ...current, reminderTime }))
        }
        options={reminderTimes.map((value) => ({ label: value, value }))}
        selectedValue={settings.reminderTime}
        title="Selecionar horário"
        visible={timeModalVisible}
      />
    </ScrollScreen>
  );
}
