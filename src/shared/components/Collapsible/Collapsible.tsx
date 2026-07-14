import { PropsWithChildren, useState } from "react";
import { IconSymbol } from "../IconSymbol/IconSymbol";
import { ThemedText } from "../ThemedText/ThemedText";
import styled from "@emotion/native";

const Root = styled.View(({ theme }) => ({ gap: theme.layout.spacing.sm }));
const Heading = styled.Pressable(({ theme }) => ({
  alignItems: "center",
  backgroundColor: theme.colors.primaryDark,
  borderRadius: theme.layout.radius.pill,
  flexDirection: "row",
  justifyContent: "space-between",
  minHeight: 48,
  paddingHorizontal: theme.layout.spacing.lg,
}));
const HeadingText = styled(ThemedText)(({ theme }) => ({
  ...theme.typography.button,
  color: theme.colors.onPrimaryMuted,
  flex: 1,
}));
const Content = styled.View(({ theme }) => ({ paddingHorizontal: theme.layout.spacing.sm }));

export function Collapsible({
  children,
  title,
  defaultOpen = false,
}: PropsWithChildren & { title: string; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <Root>
      <Heading
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        onPress={() => setIsOpen((value) => !value)}
      >
        <HeadingText>{title}</HeadingText>
        <IconSymbol
          color="onPrimaryMuted"
          name={isOpen ? "chevron.down" : "chevron.right"}
          size={26}
        />
      </Heading>
      {isOpen ? <Content>{children}</Content> : null}
    </Root>
  );
}
