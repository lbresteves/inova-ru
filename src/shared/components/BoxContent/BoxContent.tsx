import { Box, IBoxProps } from "./BoxContent.styled";

interface IBoxContentProps extends IBoxProps {
  children: React.ReactNode;
}

export const BoxContent = ({ children, ...styleProps }: IBoxContentProps) => {
  return (
    <Box bg="surface" {...styleProps}>
      {children}
    </Box>
  );
};
