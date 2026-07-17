import { Container } from "../PageBox/PageBox.styled";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../ThemedText/ThemedText";
import { useRouter } from "expo-router";
import { ThemedButton } from "../ThemedButton/ThemedButton";

export function HeaderBack({ title, onReturnPress }: { title: string; onReturnPress?: () => void }) {
    const router = useRouter();
    const onPress = onReturnPress || (() => router.replace({ pathname: "/" }));
    
    return (
        <SafeAreaView edges={["top"]} style={{ backgroundColor: "transparent" }}>
            <Container padding={10}>
                <Container flexDirection="row" centerHorizontal gap={10}>
                    <ThemedButton iconName="arrow.left" onPress={onPress} />
                    <ThemedText type="pagetitle">{title}</ThemedText>
                </Container>
            </Container>
        </SafeAreaView>
    );
}