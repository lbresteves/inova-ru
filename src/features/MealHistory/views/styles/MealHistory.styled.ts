import styled from "@emotion/native";

export const Container = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.surface,
  display: "flex",
  flexDirection: "column",
  flex: 1,
}));

export const Table = styled.View(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    flex: 1,
    borderRadius: 8,
    margin: 16,
    marginBottom: 40,
    padding: 16,
    gap: 14,
}));

export const TableHeader = styled.View(({ theme }) => ({
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "row",
    gap: 8,
}));

export const TableItem = styled.View(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 12, 
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
    marginBottom: 7,
    backgroundColor: theme.colors.background,
}));

export const ItemLeft = styled.View(({ theme }) => ({
  backgroundColor: "transparent",
}));

export const ItemLeftTitle = styled.Text(({ theme }) => ({
    fontWeight: 700,
    fontSize: 16,
    color: theme.colors.titleColor,
}));

export const ItemLeftSub = styled.Text(({ theme }) => ({
    fontSize: 12,
    color: theme.colors.mutedText,
}));

export const ItemStatusFree = styled.Text(({ theme }) => ({
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    backgroundColor: theme.colors.statusApprovedBackgroundColor,
    color: theme.colors.activeIconColor,
}));

export const ItemStatusNotFree = styled.Text(({ theme }) => ({
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 700,
    backgroundColor: "transparent",
    color: theme.colors.titleColor,
    // font-weight:700; font-size:13.5px; color:var(--ink-900);
}));