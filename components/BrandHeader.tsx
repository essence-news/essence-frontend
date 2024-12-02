import React from "react";
import { Dimensions } from "react-native";
import styled, { ThemeProvider } from "styled-components/native";
import { HeaderContainer, Logo, BrandName } from "./SharedComponents";


const BrandHeader = () => (
  <HeaderContainer width={Dimensions.get("window").width}>
    <Logo source={require("../assets/logo.png")} alt="Brand Logo" />
    <BrandName>essence</BrandName>
  </HeaderContainer>
);

export default BrandHeader;
