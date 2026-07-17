import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../ThemedText/ThemedText";
import { useRouter } from "expo-router";
import { ThemedButton } from "../ThemedButton/ThemedButton";
import { Container, Row } from "./styles/HeaderBack.styled";

export function HeaderBack({ title, onReturnPress }: { title: string; onReturnPress?: () => void }) {
    const router = useRouter();
    const onPress = onReturnPress || (() => router.replace({ pathname: "/" }));
    
    return (
        <SafeAreaView edges={["top"]} style={{ backgroundColor: "transparent" }}>
            <Container>
                <Row>
                    <ThemedButton iconName="arrow.left" onPress={onPress} />
                    <ThemedText type="pagetitle">{title}</ThemedText>
                </Row>
            </Container>
        </SafeAreaView>
    );
}