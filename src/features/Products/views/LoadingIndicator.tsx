import { useTheme } from "@emotion/react";
import { ActivityIndicator } from "react-native";

const LoadingIndicator = () => {
  const theme = useTheme();

  return (
    <ActivityIndicator
      size="large"
      color={theme.colors.foreground}
      style={{ flex: 1 }}
    />
  );
};

export default LoadingIndicator;
