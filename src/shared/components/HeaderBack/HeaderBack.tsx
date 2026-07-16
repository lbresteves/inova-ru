import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "../BoxContent/BoxContent.styled";
import { ThemedButton } from "../ThemedButton/ThemedButton";
import { ThemedText } from "../ThemedText/ThemedText";

export function HeaderBack({ title, onReturnPress }: { title: string; onReturnPress?: () => void }) {
    const router = useRouter();
    const onPress = onReturnPress || (() => router.replace({ pathname: "/" }));
    
    return (
        <SafeAreaView edges={["top"]} >
            <Box flexDirection="row" centerHorizontal gap={10}>
                <ThemedButton iconName="arrow.left" onPress={onPress} />
                <ThemedText type="pagetitle">{title}</ThemedText>
            </Box>
        </SafeAreaView>
    );
}