import React from "react";
import { Dimensions } from "react-native";
import styled from "styled-components/native";
import { router } from "expo-router";
import { HeaderContainer, Logo, BrandName } from "./SharedComponents";

const StyledPressable = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

const BrandHeader = () => (
  <HeaderContainer width={Dimensions.get("window").width}>
    <StyledPressable onPress={() => router.push("/home")}>
      <Logo source={require("../assets/logo.png")} alt="Brand Logo" />
      <BrandName>essence</BrandName>
    </StyledPressable>
  </HeaderContainer>
);

export default BrandHeader;
