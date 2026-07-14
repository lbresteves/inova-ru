import { Container } from "../PageBox/PageBox.styled";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../ThemedText/ThemedText";
import { IconSymbol } from "../IconSymbol/IconSymbol";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export function HeaderBack({ title, onReturnPress }: { title: string; onReturnPress?: () => void }) {
    const router = useRouter();
    const onPress = onReturnPress || (() => router.replace({ pathname: "/" }));
    
    return (
        <SafeAreaView edges={["top"]} style={{ backgroundColor: "transparent" }}>
            <Container padding={10}>
                <Container flexDirection="row" centerHorizontal gap={10}>
                    <TouchableOpacity
                        onPress={onPress}
                        style={{
                            backgroundColor: "#E4F3EA",
                            borderRadius: 10,
                            padding: 5,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <IconSymbol size={28} name="arrow.left" color="#0C5347" />
                    </TouchableOpacity>
                    <ThemedText type="pagetitle">{title}</ThemedText>
                </Container>
            </Container>
        </SafeAreaView>
    );
}