import { FC } from "react";
import styled from "styled-components";

export const Separator: FC = () => {
  return <Host>|</Host>;
};

const Host = styled.span`
  padding: 0 5px;
`;
