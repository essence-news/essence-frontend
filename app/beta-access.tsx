import React, { useState } from "react";
import styled from "styled-components/native";
import { WebView } from "react-native-web-webview";
import { WebView as NativeWebView } from "react-native-webview";
import { Platform } from "react-native";
{
  /* <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSd8EfZw5ioK5MGu0kABqw2Of_74GutuLFXT61ymC8O0trwPMw/viewform?embedded=true" width="500" height="1600" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe> */
}

const FormContainer = styled.View`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  color: #fff;
  padding: 32px;
  background: ${({ theme }) => theme.colors.secondaryLight};
`;

const ThankYouMessage = styled.Text`
  font-family: "${({ theme }) => theme.fonts.body}";
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-top: 20px;
  font-size: 18px;
`;

const StyledWebView = styled(WebView)`
  flex: 1;
  min-height: 800px;
`;
const StyledNativeWebView = styled(NativeWebView)`
  flex: 1;
  min-height: 800px;
`;

export default function GoogleFormScreen() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onNavigationStateChange = (navState: any) => {
    if (navState.url.includes("formResponse")) {
      setIsSubmitted(true);
    }
  };

  return (
    <FormContainer>
      {Platform.OS === "web" ? (
        <StyledWebView
          source={{
            uri: "https://docs.google.com/forms/d/e/1FAIpQLSd8EfZw5ioK5MGu0kABqw2Of_74GutuLFXT61ymC8O0trwPMw/viewform?embedded=true",
          }}
          onNavigationStateChange={onNavigationStateChange}
        />
      ) : (
        <StyledNativeWebView
          source={{
            uri: "https://docs.google.com/forms/d/e/1FAIpQLSd8EfZw5ioK5MGu0kABqw2Of_74GutuLFXT61ymC8O0trwPMw/viewform?embedded=true",
          }}
          onNavigationStateChange={onNavigationStateChange}
        />
      )}
      {isSubmitted && (
        <ThankYouMessage>
          Thanks for your interest. We will reach out to you.
        </ThankYouMessage>
      )}
    </FormContainer>
  );
}
