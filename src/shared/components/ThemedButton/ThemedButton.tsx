import { Container } from "../PageBox/PageBox.styled";
import { TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText/ThemedText";
import { IconSymbol, IconSymbolName } from "../IconSymbol/IconSymbol";
import { useTheme } from "@emotion/react";

export function ThemedButton({ iconName, onPress }: { iconName: IconSymbolName; onPress: () => void }) {
    const theme = useTheme();
    
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: theme.colors.returnBtnBackground,
                borderRadius: 10,
                padding: 5,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <IconSymbol size={28} name={iconName} color={theme.colors.returnIconColor} />
        </TouchableOpacity>
    );
}