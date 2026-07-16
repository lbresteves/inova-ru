import styled from "@emotion/native";

interface ToggleStyleProps {
  checked: boolean;
  disabled?: boolean;
}

function getTrackColor({
  checked,
  disabled,
  theme,
}: ToggleStyleProps & { theme: import("@emotion/react").Theme }) {
  if (disabled) {
    return theme.colors.controlDisabled;
  }

  return checked ? theme.colors.primary : theme.colors.controlMuted;
}

export const ToggleTrack = styled.TouchableOpacity<ToggleStyleProps>(
  ({ checked, disabled, theme }) => ({
    alignItems: "flex-start",
    backgroundColor: getTrackColor({ checked, disabled, theme }),
    borderRadius: 12,
    height: 24,
    justifyContent: "center",
    padding: 3,
    width: 42,
  })
);

export const ToggleThumb = styled.View<ToggleStyleProps>(
  ({ checked, theme }) => ({
    backgroundColor: theme.colors.onPrimary,
    borderRadius: 9,
    height: 18,
    transform: [{ translateX: checked ? 18 : 0 }],
    width: 18,
  })
);
