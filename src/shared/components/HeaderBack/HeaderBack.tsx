import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedButton } from "../ThemedButton/ThemedButton";
import { ThemedText } from "../ThemedText/ThemedText";
import { HeaderContainer } from "./HeaderBack.styled";

export type HeaderBackProps = {
  title: string;
  onReturnPress?: () => void;
};

export function HeaderBack({ title, onReturnPress }: HeaderBackProps) {
  const router = useRouter();

  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: "transparent" }}>
      <HeaderContainer>
        <ThemedButton
          iconName="arrow.left"
          onPress={onReturnPress ?? (() => router.back())}
        />
        <ThemedText type="pagetitle">{title}</ThemedText>
      </HeaderContainer>
    </SafeAreaView>
  );
}
