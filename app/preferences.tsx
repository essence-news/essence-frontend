import BrandHeader from "@/components/BrandHeader";
import { CheckBox } from "@/components/Checkbox";
import { OkCancelModal } from "@/components/Modal";
import {
  commonStyles,
  DangerText,
  FinerText,
  FormErrorMessage,
  H5,
  Input,
  StyledText,
  StyledActivityIndicator,
  StyledTextDark,
  H4,
  StyledTextLargeDark,
} from "@/components/SharedComponents";
import theme from "@/constants/theme";
import { getUserData, savePreferences } from "@/utils/api";
import { useAuth } from "@/utils/AuthProvider";
import { OptionType, preferencesFormConfig } from "@/utils/preferencesData";
import { capitalize } from "@/utils/stringUtils";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CollapsibleHeaderScrollView } from "react-native-collapsible-header-views";
import { MultiSelect } from "react-native-element-dropdown";
import styled from "styled-components/native";

export const PreferencesContainer = styled.View`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
  margin-bottom: 20px;
  position: relative;
`;

const styles = {
  dropdown: {
    height: 35,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 12,
  },
};

const AddNewButton = styled.Pressable`
  flex-direction: row;
  gap: 5px;
  padding-top: 5px;
  align-items: start;
`;

const StyledInput = styled(Input)`
  flex: 1;
  font-size: 18px;
  margin-block: 15px;
  padding: 8px;
`;
const OptionText = styled(H5)`
  margin-left: 10px;
`;

const DropDownContainer = styled.View`
  flex-direction: row;
  align-items: start;
  gap: 10px;
`;

const CollapsibleContainer = styled.View`
  margin-top: 30px;
`;

const SelectedView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 14px;
  background-color: white;
  shadow-color: #000;
  margin-top: 8px;
  margin-right: 12px;
  padding: 6px 12px;
  shadow-offset: {
    width: 0;
    height: 1px;
  }
  height: 30px;
  shadow-opacity: 0.2;
  shadow-radius: 1.41px;
  elevation: 2;
`;

const SelectedText = styled(StyledText)`
  margin-right: 5px;
  font-family: "${({ theme }) => theme.fonts.bodyBold}";
  color: ${({ theme }) => theme.colors.primary};
`;

const Item = styled.View`
  padding: 17px;
  flex-direction: row;
  align-items: center;
`;

const LoadMoreButton = styled.Pressable`
  margin-top: 30;
`;

const LoadMoreButtonText = styled(StyledText)`
  font-family: "${({ theme }) => theme.fonts.bodyBold}";
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.accent};
  padding: 10px;
  border-radius: 5px;
`;

const PreferencesLabel = styled(StyledTextLargeDark)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.primaryDark};
  font-family: "${({ theme }) => theme.fonts.body}";
`;

const StyledAction = styled(AntDesign)<{ mt: string }>`
  margin-top: ${({ mt }) => mt};
  color: ${({ theme }) => theme.colors.primary};
`;
const StyledActionText = styled(StyledText)`
  color: ${({ theme }) => theme.colors.primary};
`;

const StyledCollapsibleHeaderScrollView = styled(CollapsibleHeaderScrollView)`
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  max-width: 500px;
`;
const StyledContainer = styled.View`
  flex: 1;
  justify-content: space-between;
  align-items: center;
`;

const HeaderContainer = styled.View`
  padding: 10px 20px;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

const PreferencesText = styled(H4)`
  padding: 10px;
  margin: 0px;
  text-align: left;
  color: ${({ theme }) => theme.colors.primaryDark};
  font-family: ${({ theme }) => theme.fonts.body};
  flex: 1;
`;

const SaveButtonText = styled(H5)`
  padding: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
`;

const MultiSelectFormFieldContainer = styled.View`
  gap: 10px;
  margin-block: 15px;
`;

const InputFormFieldContainer = styled.View`
  margin-top: 30px;
`;

const FormInput = styled(Input)<{ isDisabled: boolean }>`
  margin-top: 10px;
  background-color: ${({ isDisabled }) =>
    isDisabled ? "rgba(0, 0, 0, 0.1)" : "initial"};
`;

const PAGE_SIZE = 5;

const Divider = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.secondaryLight};
  margin: 40px 0 20px;
`;

export default function Preferences() {
  const [isFocus, setIsFocus] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { fromSignIn } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState<any>(null);
  const [sliceIndex, setSliceIndex] = useState(0);
  const elementRefs = useRef({});
  const [payload, setPayload] = useState<{ [key: string]: string | string[] }>(
    {},
  );
  const { user, logout } = useAuth();
  const [addValue, setAddValue] = useState("");
  const [userData, setUserData] = useState();
  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const userDataResponse = await getUserData();
        // setInitialPreferences({
        //   ...userDataResponse.preferences.json,
        // });
        const payloadObj: { [key: string]: string } = {
          ...userDataResponse.preferences.json,
        };
        preferencesFormConfig
          .filter((p) => !p.dynamic)
          .forEach((p) => {
            payloadObj[p.id] = userDataResponse[p.id];
          });
        setLoading(false);

        setPayload(payloadObj);
        console.log({ payloadObj });
        setUserData(userDataResponse);
      } catch (err) {
        if (err.message === "Unauthorized") {
          logout();
        }
        console.error(err);
        // setArticles(mockNewsData.articles);
        // await AsyncStorage.setItem("newsData", JSON.stringify(mockNewsData));
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  function onCancel() {
    setShowAddModal(null);
    setAddValue("");
  }

  function onOkInAddModal() {
    const option = showAddModal;
    handleCheckboxToggle(option.id, addValue, true);
    onCancel();
  }

  const validateFields = () => {
    const mandatoryFields = preferencesFormConfig.filter(
      (p) => p.mandatory && !p.disabled,
    );
    const errorObj: { [key: string]: string } = {};
    let valid = true;
    mandatoryFields.forEach((m) => {
      if (!payload[m.id]) {
        errorObj[m.id] = "Please provide a value";
        valid = false;
      }
    });
    setErrors(errorObj);
    if (!valid) {
      elementRefs.current?.[Object.keys(errorObj)[0]]?.focus();
    }
    return valid;
  };

  const handleSave = async () => {
    if (loading) return;
    if (!validateFields()) return;
    setLoading(true);
    console.log("will send", payload);
    const saveResponse = await savePreferences({
      ...payload,
      country: "GB",
      language: "EN",
    });
    console.log({ saveResponse });
    setLoading(false);
    const userClone = {
      ...user,
    };
    preferencesFormConfig
      .filter((p) => p.mandatory)
      .forEach((p) => {
        if (userClone) userClone[p.id] = payload[p.id];
      });
    await AsyncStorage.setItem("user", JSON.stringify(userClone));

    router.push("/player");
  };
  const handleCheckboxToggle = (
    id: string,
    value: string,
    selected: boolean,
  ) => {
    // console.log("handlecheckboxtoggle", { id, value, selected });

    if (selected) {
      setPayload((p) => {
        const existingValues = p[id] === undefined ? [] : p[id];
        // console.log({
        //   existingValues,
        //   val: [
        //     ...(existingValues as string[])?.map((e) => e.trim() || []),
        //     value.toLowerCase(),
        //   ],
        // });
        return {
          ...p,
          [id]: [
            ...(existingValues as string[])?.map((e) => e.trim() || []),
            value.toLowerCase(),
          ],
        };
      });
    } else {
      setPayload((p) => {
        console.log({ p });

        return {
          ...p,
          [id]: ((p[id] ?? []) as string[])
            .map((e) => e.trim())
            .filter((f) => f.trim() !== value.toLowerCase().trim()),
        };
      });
    }
  };
  const renderItem = (
    fieldId: string,
    item: OptionType,
    selected: boolean | undefined,
  ) => {
    // console.log({ fieldId, item, selected });
    return (
      <Item>
        <CheckBox
          checked={selected}
          onPress={() => handleCheckboxToggle(fieldId, item.value, !selected)}
        />
        <OptionText>{item.label}</OptionText>
      </Item>
    );
  };

  const textFields = preferencesFormConfig.filter((f) => f.type === "text");
  const multiSelectFields = preferencesFormConfig.filter(
    (f) => f.type === "multiselect",
  );
  // console.log("render", {
  //   first_name: payload?.first_name,
  //   payload,
  //   userData,
  //   loading,
  //   preferencesFormConfig,
  // });
  return (
    <>
      <StyledContainer>
        <BrandHeader />
        {Object.keys(payload).length === 0 && loading ? (
          <StyledActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <CollapsibleContainer>
            <StyledCollapsibleHeaderScrollView
              CollapsibleHeaderComponent={
                <HeaderContainer>
                  {!fromSignIn && (
                    <Pressable onPress={() => router.push("/player")}>
                      <AntDesign
                        name="left"
                        size={20}
                        color={theme.colors.primary}
                      />
                    </Pressable>
                  )}
                  <PreferencesText>Preferences</PreferencesText>
                  <TouchableOpacity onPress={handleSave}>
                    {loading ? (
                      <SaveButtonText>Saving</SaveButtonText>
                    ) : (
                      <SaveButtonText>Save</SaveButtonText>
                    )}
                  </TouchableOpacity>
                </HeaderContainer>
              }
              headerHeight={60}
              headerContainerBackgroundColor={theme.colors.secondaryLight}
              // headerContainerBackgroundColor="red"
              statusBarHeight={Platform.OS === "ios" ? 20 : 0}
            >
              <PreferencesContainer>
                <StyledTextDark style={{ paddingVertical: 10 }}>
                  To serve you with the relevant retail news articles we would
                  like to know a bit more about you and your preferences
                </StyledTextDark>
                <H5
                  style={{
                    padding: 10,
                    marginVertical: 10,
                    backgroundColor: theme.colors.secondaryLight,
                  }}
                >
                  About You
                </H5>
                {textFields.map((f) => {
                  // console.log({
                  //   value: payload?.[f.id] || "",
                  //   id: f.id,
                  // });
                  return (
                    <InputFormFieldContainer key={f.id}>
                      <PreferencesLabel>
                        {f.label}
                        {f.mandatory && <DangerText>*</DangerText>}
                      </PreferencesLabel>
                      <FormInput
                        id={f.id}
                        ref={(element) => (elementRefs.current[f.id] = element)}
                        placeholder={f.placeholder ?? ""}
                        placeholderTextColor={theme.colors.secondaryDarker}
                        isDisabled={f.disabled}
                        value={
                          payload?.[f.id] ??
                          userData?.[f.id] ??
                          f.defaultValue ??
                          ""
                        }
                        onChangeText={(v) => {
                          setPayload((p) => ({
                            ...p,
                            [f.id]: v,
                          }));
                        }}
                        focusable={!f.disabled}
                        editable={!f.disabled}
                      />
                      {errors[f.id] ? (
                        <FormErrorMessage>{errors[f.id]}</FormErrorMessage>
                      ) : (
                        <Text></Text>
                      )}
                      {f.footnote && <FinerText>{f.footnote}</FinerText>}
                    </InputFormFieldContainer>
                  );
                })}
                {sliceIndex > 0 && (
                  <>
                    <Divider />
                    <H5
                      style={{
                        padding: 10,
                        marginVertical: 10,
                        backgroundColor: theme.colors.secondaryLight,
                      }}
                    >
                      Your Interests
                    </H5>
                  </>
                )}
                {multiSelectFields.slice(0, sliceIndex).map((p) => {
                  const data = [...(p.defaultValues || [])];
                  console.log({ payload });
                  if (payload?.[p.id]?.length > 0) {
                    const definedValues =
                      payload?.[p.id] !== undefined ? payload?.[p.id] : [];
                    console.log({ definedValues });
                    (definedValues as string[])?.forEach((f) => {
                      if (
                        !data.find(
                          (val) =>
                            val.value.trim().toLowerCase() ===
                            f.trim().toLowerCase(),
                        )
                      ) {
                        data.push({
                          label: capitalize(f),
                          value: f.toLowerCase(),
                          selected: true,
                        });
                      }
                    });
                  }
                  // console.log("multiselect", p.id, {
                  //   p,
                  //   data,
                  //   payload,
                  //   value: payload?.[p.id] || [],
                  // });
                  return (
                    <MultiSelectFormFieldContainer key={p.id}>
                      <View>
                        <PreferencesLabel>
                          {p.label}
                          {p.mandatory && <DangerText>*</DangerText>}
                        </PreferencesLabel>
                      </View>
                      <DropDownContainer>
                        <View style={commonStyles.flex_1}>
                          <MultiSelect
                            style={[
                              styles.dropdown,
                              isFocus && {
                                borderColor: theme.colors.primaryLight,
                              },
                            ]}
                            placeholder={p.placeholder ?? ""}
                            placeholderStyle={styles.placeholderStyle}
                            data={data}
                            // search
                            // in
                            value={
                              (payload?.[p.id] ||
                                userData?.[p.id] ||
                                []) as string[]
                            }
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocus ? "" : ""}
                            searchPlaceholder="Search..."
                            onFocus={() => setIsFocus(p.id)}
                            onBlur={() => setIsFocus("")}
                            onChange={(item) => {
                              // console.log({ item, p });
                              setPayload((pload) => ({
                                ...pload,
                                [p.id]: [...item],
                              }));
                              setIsFocus("");
                            }}
                            renderSelectedItem={(item, unSelect) => {
                              // console.log("renderSelectedItem", { item });
                              return (
                                <TouchableOpacity
                                  onPress={() => unSelect && unSelect(item)}
                                >
                                  <SelectedView>
                                    <SelectedText>{item.label}</SelectedText>
                                    <AntDesign
                                      color={theme.colors.primary}
                                      name="close"
                                      size={12}
                                    />
                                  </SelectedView>
                                </TouchableOpacity>
                              );
                            }}
                            renderItem={(...params) =>
                              renderItem(p.id, ...params)
                            }
                          />
                        </View>
                        <AddNewButton onPress={() => setShowAddModal(p)}>
                          <StyledAction
                            mt={Platform.OS === "web" ? "1px" : "3px"}
                            name="pluscircleo"
                            size={12}
                          />
                          <StyledActionText>Add new</StyledActionText>
                        </AddNewButton>
                      </DropDownContainer>
                      {p.footnote && <FinerText>{p.footnote}</FinerText>}
                    </MultiSelectFormFieldContainer>
                  );
                })}
                {sliceIndex < multiSelectFields.length ? (
                  <LoadMoreButton
                    onPress={() => setSliceIndex((s) => s + PAGE_SIZE)}
                  >
                    <LoadMoreButtonText>
                      Load more preferences
                    </LoadMoreButtonText>
                  </LoadMoreButton>
                ) : (
                  <Text></Text>
                )}
              </PreferencesContainer>
            </StyledCollapsibleHeaderScrollView>
          </CollapsibleContainer>
        )}
      </StyledContainer>
      {!!showAddModal && (
        <OkCancelModal
          onCancel={onCancel}
          onOk={onOkInAddModal}
          label={"Add Custom " + showAddModal.label}
        >
          <StyledInput
            onChangeText={setAddValue}
            value={addValue}
            placeholder=""
          />
        </OkCancelModal>
      )}
    </>
  );
}
