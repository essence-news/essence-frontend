import React from "react";
import { Dimensions } from "react-native";
import styled, { ThemeProvider } from "styled-components/native";
import { HeaderContainer } from "./SharedComponents";

const BrandName = styled.Text`
  margin: 0;
  color: ${({ theme }) => theme.colors.white};
  font-family: "${({ theme }) => theme.fonts.brand}";
  font-size: 28px;
  display: inline;
  text-align: left;
`;

const Logo = styled.Image`
  height: 28px;
  width: 28px;
  margin-right: 20px;
`;

const BrandHeader = () => (
  <HeaderContainer width={Dimensions.get("window").width}>
    <Logo source={require("../assets/logo.png")} alt="Brand Logo" />
    <BrandName>essence</BrandName>
  </HeaderContainer>
);

export default BrandHeader;
