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

export const RUCard = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.background,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: theme.colors.border,
  padding: 16,
  gap: 16,
}));

export const RUCardTitle = styled.Text(({ theme }) => ({
  fontWeight: 700,
  fontSize: 15,
  color: theme.colors.titleColor,
}));

export const SectionBlock = styled.View({
  gap: 6,
});

export const SectionTitle = styled.Text(({ theme }) => ({
  fontWeight: 700,
  fontSize: 15,
  color: theme.colors.titleColor,
}));

export const DishChip = styled.Text(({ theme }) => ({
  borderWidth: 1,
  borderColor: theme.colors.border,
  color: theme.colors.primary,
  borderRadius: 999,
  paddingVertical: 4,
  paddingHorizontal: 14,
  fontSize: 13.5,
  fontWeight: "600",
  overflow: "hidden",
}));