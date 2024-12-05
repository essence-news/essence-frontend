import React from "react";
import { Modal } from "react-native";
import { H5 } from "./SharedComponents";
import styled from "styled-components/native";

const ModalTitle = styled(H5)`
  padding: 10px;
  margin: 0;
  text-align: left;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.headingBold};
  background-color: ${({ theme }) => theme.colors.secondary};
`;

const StyledScrollView = styled.ScrollView`
  padding: 10px;
`;

const StyledContainer = styled.View`
  background-color: #0004;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const StyledCard = styled.View`
  width: 90%;
  border-radius: 5px;
  background-color: #fff;
`;

const ActionsContainer = styled.View`
  flex-direction: row;
  border-top-width: 1px;
  gap: 5px;
  border-color: #eee;
`;

const CancelButton = styled.TouchableOpacity`
  flex: 1;
  padding: 10px;
  align-items: center;
  border-width: 1px;
  border-radius: 5px;
  bordercolor: ${({ theme }) => theme.colors.primaryDark};
  backgroundcolor: ${({ theme }) => theme.colors.primary};
`;

const OkButton = styled.TouchableOpacity`
  flex: 1;
  padding: 10px;
  align-items: center;
  border-width: 1px;
  border-radius: 5px;
  border-color: ${({ theme }) => theme.colors.secondaryDark};
  background-color: ${({ theme }) => theme.colors.secondary};
`;
export const CancelButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
`;
export const OkButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
`;

export type ModalInputProps = {
  onCancel: () => void;
  onOk: () => void;
  label: string;
};

type Props = {
  children: React.ReactChild | React.ReactChild[];
} & ModalInputProps;

export function OkCancelModal({ children, onCancel, onOk, label = "" }: Props) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={() => null}
    >
      <StyledContainer>
        <StyledCard>
          <ModalTitle>{label}</ModalTitle>
          <StyledScrollView keyboardShouldPersistTaps="always">
            {children}
            <ActionsContainer>
              <CancelButton onPress={onCancel}>
                <CancelButtonText>CANCEL</CancelButtonText>
              </CancelButton>
              <OkButton onPress={onOk}>
                <OkButtonText>OK</OkButtonText>
              </OkButton>
            </ActionsContainer>
          </StyledScrollView>
        </StyledCard>
      </StyledContainer>
    </Modal>
  );
}
