import styled from "@emotion/native";
import { ThemedText } from "../ThemedText/ThemedText";

export const WHEEL_ITEM_HEIGHT = 44;
export const WHEEL_VISIBLE_ITEMS = 5;

interface WheelItemStyleProps {
  selected?: boolean;
}

interface TimeInputStyleProps {
  disabled?: boolean;
}

export const TimeInputButton = styled.TouchableOpacity<TimeInputStyleProps>(
  ({ disabled, theme }) => ({
    alignItems: "center",
    backgroundColor: disabled
      ? theme.colors.controlDisabled
      : theme.colors.background,
    borderColor: disabled ? theme.colors.controlDisabled : theme.colors.border,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 36,
    minWidth: 56,
    paddingHorizontal: 10,
  })
);

export const TimeInputText = styled(ThemedText)<TimeInputStyleProps>(
  ({ disabled, theme }) => ({
    color: disabled ? theme.colors.mutedText : theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  })
);

export const ModalRoot = styled.View({
  flex: 1,
  justifyContent: "flex-end",
});

export const ModalBackdrop = styled.Pressable(({ theme }) => ({
  backgroundColor: theme.colors.foreground,
  bottom: 0,
  left: 0,
  opacity: 0.45,
  position: "absolute",
  right: 0,
  top: 0,
}));

export const WheelSheet = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.background,
  borderTopLeftRadius: 18,
  borderTopRightRadius: 18,
  paddingBottom: 24,
  paddingHorizontal: 20,
  paddingTop: 14,
}));

export const WheelHeader = styled.View({
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
  minHeight: 42,
});

export const WheelActionText = styled(ThemedText)<{ primary?: boolean }>(
  ({ primary, theme }) => ({
    color: primary ? theme.colors.primary : theme.colors.mutedText,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  })
);

export const WheelTitle = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.text,
  fontSize: 16,
  fontWeight: "700",
  lineHeight: 22,
}));

export const WheelColumns = styled.View({
  alignItems: "center",
  flexDirection: "row",
  gap: 10,
  justifyContent: "center",
  paddingVertical: 8,
});

export const WheelColumn = styled.View(({ theme }) => ({
  height: WHEEL_ITEM_HEIGHT * WHEEL_VISIBLE_ITEMS,
  overflow: "hidden",
  position: "relative",
  width: 86,
}));

export const WheelSelectionMarker = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.primaryMuted,
  borderRadius: 12,
  height: WHEEL_ITEM_HEIGHT,
  left: 0,
  position: "absolute",
  right: 0,
  top: WHEEL_ITEM_HEIGHT * 2,
}));

export const WheelItem = styled.View<WheelItemStyleProps>(({ selected }) => ({
  alignItems: "center",
  height: WHEEL_ITEM_HEIGHT,
  justifyContent: "center",
  opacity: selected ? 1 : 0.55,
}));

export const WheelItemText = styled(ThemedText)<WheelItemStyleProps>(
  ({ selected, theme }) => ({
    color: selected ? theme.colors.primary : theme.colors.text,
    fontSize: selected ? 24 : 18,
    fontWeight: selected ? "700" : "500",
    lineHeight: 30,
  })
);

export const TimeSeparator = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.text,
  fontSize: 24,
  fontWeight: "700",
  lineHeight: 30,
}));
