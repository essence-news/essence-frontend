import styled from "styled-components/native";
import { Button, StyledText } from "./SharedComponents";
import { router } from "expo-router";

const JoinText = styled(StyledText)`
  color: #fff;
  text-transform: uppercase;
`;

const JoinButton = () => {
  const goToHome = () => {
    router.push("/home");
  };
  return (
    <Button onPress={goToHome}>
      <JoinText>Join</JoinText>
    </Button>
  );
};

export default JoinButton;
