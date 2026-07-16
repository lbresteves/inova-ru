import styled from "@emotion/native";
import { ThemedText } from "../ThemedText/ThemedText";

interface InputStyleProps {
  isStrong?: boolean;
}

export const InputContainer = styled.View({
  gap: 6,
  width: "100%",
});

export const InputLabel = styled(ThemedText)(({ theme }) => ({
  color: theme.colors.primary,
  fontSize: 13,
  fontWeight: "700",
  lineHeight: 18,
}));

export const InputField = styled.TextInput<InputStyleProps>(
  ({ isStrong, theme }) => ({
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: 10,
    borderWidth: 1,
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: isStrong ? "700" : "400",
    minHeight: 56,
    paddingHorizontal: 14,
    paddingVertical: 12,
    width: "100%",
  })
);
