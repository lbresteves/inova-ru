/* eslint-disable @typescript-eslint/no-empty-object-type */
import { ComponentProps, PropsWithChildren } from "react";
import { Container } from "./PageBox.styled";

export interface IPageBoxProps extends ComponentProps<typeof Container> {}

export const PageBox = ({
  children,
  ...boxProps
}: IPageBoxProps & PropsWithChildren) => {
  return <Container {...boxProps}>{children}</Container>;
};
