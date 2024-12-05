import { H4, H5 } from "@/components/SharedComponents";
import { Link, Stack } from "expo-router";
import styled from "styled-components/native";

const StyledView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const StyledHeading = styled(H4)`
  font-family: "${({ theme }) => theme.fonts.body}";
`;

const StyledLink = styled(Link)`
margin-top: 15,
    padding-block: 15
`;

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <StyledView>
        <StyledHeading>This screen doesn't exist.</StyledHeading>

        <StyledLink href="/">
          <H5>Go to home screen!</H5>
        </StyledLink>
      </StyledView>
    </>
  );
}
