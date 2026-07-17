import styled from "@emotion/native";

export const SelectTouchable = styled.TouchableOpacity<{ active?: boolean }>(({ active, theme }) => ({
    display: "flex",
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: active ? theme.colors.filterActiveBorderColor : "#E1EAE6",
    backgroundColor: active ? theme.colors.statusApprovedBackgroundColor : "#fff",
    fontSize: 12,
    fontWeight: 600,
    color: active ? theme.colors.activeIconColor : theme.colors.unactiveIconColor,
    cursor: "pointer",
    alignSelf: "flex-start",
}));

export const SelectLabel = styled.Text<{ active?: boolean }>(({ active, theme }) => ({
    color: active ? theme.colors.activeIconColor : theme.colors.unactiveIconColor,
}));

export const SelectOption = styled.TouchableOpacity<{ active?: boolean }>(({ active, theme }) => ({

}));
