import React from "react";
import { Dimensions, Pressable } from "react-native";
import styled, { ThemeProvider } from "styled-components/native";
import { router } from "expo-router";
import { HeaderContainer, Logo, BrandName } from "./SharedComponents";

const BrandHeader = () => (
  <HeaderContainer width={Dimensions.get("window").width}>
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
      onPress={() => router.push("/home")}
    >
      <Logo source={require("../assets/logo.png")} alt="Brand Logo" />
      <BrandName>essence</BrandName>
    </Pressable>
  </HeaderContainer>
);

export default BrandHeader;
