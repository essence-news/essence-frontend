import React from "react";
import styled, { ThemeProvider } from "styled-components/native";
import { HeaderContainer } from "./SharedComponents";

const BrandName = styled.Text`
  margin: 0;
  color: ${({ theme }) => theme.colors.white};
  font-family: "${({ theme }) => theme.fonts.brand}";
  font-size: 28;
  display: inline;
  text-align: left;
  font-weight: bold;
`;

const Logo = styled.Image`
  height: 24;
  margin-right: 20;
`;

const BrandHeader = () => (
  <HeaderContainer>
    <Logo
      source={require("../assets/logo64.svg")}
      alt="Brand Logo"
      style={{ width: 24, height: 24 }}
    />
    <BrandName>essence</BrandName>
  </HeaderContainer>
);

export default BrandHeader;
