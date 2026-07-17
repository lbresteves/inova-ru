import styled from "@emotion/native";

import { ThemedText } from "@shared/components";

const Chip = styled.Pressable<{ selected: boolean }>(
  ({ theme, selected }) => ({
    alignItems: "center",
    backgroundColor: selected
      ? theme.colors.primary
      : theme.colors.background,
    borderColor: selected ? theme.colors.primary : theme.colors.border,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 38,
    paddingHorizontal: 16,
  }),
);

const ChipText = styled(ThemedText)<{ selected: boolean }>(
  ({ theme, selected }) => ({
    color: selected ? theme.colors.onPrimary : theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 18,
  }),
);

export type RechargePresetChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function RechargePresetChip({
  label,
  selected,
  onPress,
}: RechargePresetChipProps) {
  return (
    <Chip
      onPress={onPress}
      selected={selected}
    >
      <ChipText selected={selected}>{label}</ChipText>
    </Chip>
  );
}
