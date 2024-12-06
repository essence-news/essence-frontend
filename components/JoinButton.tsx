import styled from "styled-components/native";
import { Button, H5, StyledText } from "./SharedComponents";
import { router } from "expo-router";

const JoinText = styled(H5)`
  color: #fff;
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
