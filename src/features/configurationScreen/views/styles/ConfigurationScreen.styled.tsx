import styled from "@emotion/native";
import { ThemedText } from "@shared/components";

export const Container = styled.ScrollView(({ theme }) => ({
  backgroundColor: theme.colors.background,
  flex: 1,
}));

export const Content = styled.View({
  gap: 32,
  paddingBottom: 40,
  paddingHorizontal: 20,
  paddingTop: 24,
});

export const Section = styled.View({
  gap: 16,
});

export const SectionTitle = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.text,
  fontSize: 16,
  fontWeight: "700",
  lineHeight: 22,
}));

export const SettingRow = styled.View({
  alignItems: "center",
  flexDirection: "row",
  gap: 10,
});

export const SettingLabel = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.primary,
  flexShrink: 1,
  fontSize: 14,
  fontWeight: "700",
  lineHeight: 20,
}));

export const NotificationSubsection = styled.View({
  gap: 16,
  paddingHorizontal: 10,
});

export const OptionRow = styled.View({
  flexDirection: "row",
  flexWrap: "nowrap",
  gap: 8,
  width: "100%",
});

export const WeekDayRow = styled.View({
  flexDirection: "row",
  gap: 8,
  width: "100%",
});

export const ScheduleRow = styled.View({
  alignItems: "center",
  flexDirection: "row",
  gap: 8,
});

export const ScheduleLabel = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.primary,
  fontSize: 14,
  fontWeight: "700",
  lineHeight: 20,
}));
