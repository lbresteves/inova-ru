import { TopBar, TopBarActions } from "@/src/features/Home/HomeHeader/styles/HomeHeader.styled";
import { Container } from "../PageBox/PageBox.styled";
import { ArrowLeftIcon } from "../../icons/ArrowIcon";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../ThemedText/ThemedText";

export function HeaderBack({ title, onReturnPress }: { title: string; onReturnPress: () => void }) {
    return (
        <SafeAreaView edges={["top"]} style={{ backgroundColor: "transparent" }}>
            <Container padding={10}>
                <TopBarActions >
                    <ArrowLeftIcon size={32} color="#0C5347" onPress={onReturnPress} />
                    <ThemedText type="pagetitle">{title}</ThemedText>
                </TopBarActions>
            </Container>
        </SafeAreaView>
    );
}