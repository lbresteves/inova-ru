import styled from "@emotion/native";

export const Container = styled.View(({ theme }) => ({
  backgroundColor: "transparent",
  padding: 10,
}));

export const Row = styled.View(({ theme }) => ({
  backgroundColor: "transparent",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: 10,
}));
