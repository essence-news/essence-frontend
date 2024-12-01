import BrandHeader from "@/components/BrandHeader";
import { CheckBox } from "@/components/Checkbox";
import { OkCancelModal } from "@/components/Modal";
import { Button, FormErrorMessage, Input } from "@/components/SharedComponents";
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
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
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

  position: relative;
`;

const LoadMoreButtonText = styled.Text`
  font-size: 12px;
  font-family: "${({ theme }) => theme.fonts.bodyBold}";
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.accent};
  padding: 10px;
  border-radius: 5px;
`;

const PreferencesLabel = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primary};
  font-family: "${({ theme }) => theme.fonts.bodyBold}";
`;

const StyledAction = styled(AntDesign)`
  color: ${({ theme }) => theme.colors.primary};
`;
const StyledActionText = styled.Text`
  font-size: 14;
  color: ${({ theme }) => theme.colors.primary};
`;

type PreferencesType = {
  first_name: string;
  email: string;
  industries: string;
  geographies: string;
  news_sources: string;
  functions: string;
  topics: string;
  brands: string;
};

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
`;

const PAGE_SIZE = 3;

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
        const existingValues =
          p[id] === undefined ? [] : p[id] === "" ? [] : p[id];

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
        // console.log({ p, initialPreferences });

        return {
          ...p,
          [id]: ((p[id] ?? []) as string[])
            .map((e) => e.trim())
            .filter((f) => f.trim() !== value.toLowerCase().trim())
            .join(","),
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
      <View style={styles.item}>
        <CheckBox
          checked={selected}
          onPress={() => handleCheckboxToggle(fieldId, item.value, !selected)}
        />
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
      </View>
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
    <StyledContainer>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <BrandHeader />
        {Object.keys(payload).length === 0 && loading ? (
          <ActivityIndicator
            style={{ flex: 1, justifyContent: "center" }}
            size="large"
            color={theme.colors.primary}
          />
        ) : (
          <StyledCollapsibleHeaderScrollView
            CollapsibleHeaderComponent={
              <View
                style={{
                  padding: 20,
                  marginTop: 50,
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                {!fromSignIn && (
                  <Pressable onPress={() => router.push("/player")}>
                    <AntDesign
                      name="left"
                      size={20}
                      color={theme.colors.primary}
                    />
                  </Pressable>
                )}
                <Text
                  style={{
                    fontSize: 16,
                    padding: 10,
                    margin: 0,
                    textAlign: "left",
                    borderTopStartRadius: 5,
                    borderTopEndRadius: 5,
                    color: theme.colors.primary,
                    fontFamily: theme.fonts.headingBold,
                    flex: 1,
                  }}
                >
                  Preferences
                </Text>
                <Button
                  onPress={handleSave}
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.secondary,
                    fontSize: 14,
                  }}
                >
                  {loading ? (
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: theme.fonts.body,
                        color: theme.colors.secondary,
                      }}
                    >
                      Saving
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: theme.fonts.body,
                        color: theme.colors.secondary,
                      }}
                    >
                      Save
                    </Text>
                  )}
                </Button>
              </View>
            }
            headerHeight={130}
            headerContainerBackgroundColor={theme.colors.secondary}
            statusBarHeight={Platform.OS === "ios" ? 20 : 0}
          >
            <PreferencesContainer style={{ paddingInline: 20 }}>
              {textFields.map((f) => {
                // console.log({
                //   value: payload?.[f.id] || "",
                //   id: f.id,
                // });
                return (
                  <View key={f.id} style={{ marginTop: 20 }}>
                    <PreferencesLabel>
                      {f.label}
                      {f.mandatory && (
                        <Text style={{ color: theme.colors.error }}>*</Text>
                      )}
                    </PreferencesLabel>
                    {f.footnote && (
                      <Text style={{ fontSize: 10 }}>{f.footnote}</Text>
                    )}
                    <Input
                      id={f.id}
                      ref={(element) => (elementRefs.current[f.id] = element)}
                      // placeholder="Verification Code"
                      value={payload?.[f.id] ?? userData?.[f.id] ?? ""}
                      onChangeText={(v) => {
                        // console.log({ f, v });
                        setPayload((p) => ({
                          ...p,
                          [f.id]: v,
                        }));
                      }}
                      // disabled={isLoading}
                      style={{
                        marginTop: 10,
                        backgroundColor: f.disabled
                          ? "rgba(0, 0, 0, 0.1)"
                          : "initial",
                      }}
                      focusable={!f.disabled}
                      editable={!f.disabled}
                    />
                    {errors[f.id] ? (
                      <FormErrorMessage>{errors[f.id]}</FormErrorMessage>
                    ) : (
                      <Text></Text>
                    )}
                  </View>
                );
              })}
              {multiSelectFields.slice(0, sliceIndex).map((p) => {
                const data = [...(p.defaultValues || [])];
                if (payload?.[p.id] !== "") {
                  const definedValues =
                    payload?.[p.id] !== undefined ? payload?.[p.id] : [];

                  (definedValues as string[]).forEach((f) => {
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
                //   initialPreferences,
                //   value:
                //     payload?.[p.id] ||
                //     initialPreferences?.[p.id]?.map((e) =>
                //       e.trim().toLowerCase(),
                //     ) ||
                //     [],
                // });
                return (
                  <View
                    key={p.id}
                    style={{
                      gap: 10,
                      marginBlock: 25,
                    }}
                  >
                    <View>
                      <PreferencesLabel>
                        {p.label}
                        {p.mandatory && (
                          <Text style={{ color: theme.colors.error }}>*</Text>
                        )}
                      </PreferencesLabel>
                      {p.footnote && (
                        <Text style={{ fontSize: 10 }}>{p.footnote}</Text>
                      )}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        flex: 1,
                        alignItems:
                          // (data?.filter((d) => d.selected) || []).length > 0
                          //   ? "start"
                          // :
                          "start",
                        gap: 10,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <MultiSelect
                          style={[
                            styles.dropdown,
                            isFocus && {
                              borderColor: theme.colors.primaryLight,
                            },
                          ]}
                          placeholderStyle={styles.placeholderStyle}
                          // selectedTextStyle={styles.selectedTextStyle}
                          // inputSearchStyle={styles.inputSearchStyle}
                          // iconStyle={styles.iconStyle}
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
                              [p.id]: item.join(","),
                            }));
                            setIsFocus("");
                          }}
                          renderSelectedItem={(item, unSelect) => {
                            // console.log("renderSelectedItem", { item });
                            return (
                              <TouchableOpacity
                                onPress={() => unSelect && unSelect(item)}
                              >
                                <View style={styles.selectedStyle}>
                                  <Text style={styles.textSelectedStyle}>
                                    {item.label}
                                  </Text>
                                  <AntDesign
                                    color={theme.colors.primary}
                                    name="close"
                                    size={12}
                                  />
                                </View>
                              </TouchableOpacity>
                            );
                          }}
                          renderItem={(...params) =>
                            renderItem(p.id, ...params)
                          }
                        />
                      </View>
                      <Pressable
                        onPress={() => setShowAddModal(p)}
                        style={{
                          flexDirection: "row",
                          gap: 5,
                          paddingTop: 8,
                          alignItems: "center",
                        }}
                      >
                        <StyledAction name="pluscircleo" size={14} />
                        <StyledActionText>Add new</StyledActionText>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
              {sliceIndex < multiSelectFields.length ? (
                <Pressable onPress={() => setSliceIndex((s) => s + PAGE_SIZE)}>
                  <LoadMoreButtonText>Load more preferences</LoadMoreButtonText>
                </Pressable>
              ) : (
                <Text></Text>
              )}
              {!!showAddModal && (
                <OkCancelModal
                  onCancel={onCancel}
                  onOk={onOkInAddModal}
                  label={"Add Custom " + showAddModal.label}
                >
                  <Input
                    onChangeText={setAddValue}
                    value={addValue}
                    style={styles.textInput}
                    placeholder=""
                  />
                </OkCancelModal>
              )}
            </PreferencesContainer>
          </StyledCollapsibleHeaderScrollView>
        )}
      </ScrollView>
    </StyledContainer>
  );
}

const styles = {
  container: {
    flex: 1,
  },
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
  item: {
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "white",
    shadowColor: "#000",
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 12,
    fontFamily: theme.fonts.bodyBold,
    color: theme.colors.primary,
  },
  icon: {
    marginRight: 5,
  },
  selectedTextStyle: {
    fontSize: 14,
    marginLeft: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    marginVertical: 15,
    padding: 10,
  },
};
