import BrandHeader from "@/components/BrandHeader";
import { CheckBox } from "@/components/Checkbox";
import { OkCancelModal } from "@/components/Modal";
import { Button, Input, Title } from "@/components/SharedComponents";
import theme from "@/constants/theme";
import { getPreferences } from "@/utils/api";
import { useAuth } from "@/utils/AuthProvider";
import { OptionType, preferencesFormConfig } from "@/utils/preferencesData";
import { capitalize } from "@/utils/stringUtils";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage, {
  useAsyncStorage,
} from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
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
  firstName: string;
  emailID: string;
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
`;
const StyledContainer = styled.View`
  flex: 1;
  justify-content: space-between;
`;

export default function Preferences() {
  const [isFocus, setIsFocus] = useState("");
  const { fromSignIn } = useLocalSearchParams();

  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState<any>(null);
  const [initialPreferences, setInitialPreferences] = useState<
    { [key: string]: string } | undefined
  >();
  const [payload, setPayload] = useState<{ [key: string]: string }>({});
  const [addValue, setAddValue] = useState("");

  useEffect(() => {
    async function init() {
      const preferencesData = await getPreferences();
      setInitialPreferences({
        ...preferencesData,
        firstName: user?.firstName || "",
        emailID: user?.email || "",
      });
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

  const handleSave = () => {
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
        // console.log({ p, initialPreferences });
        if (!initialPreferences) return p;
        const existingValues =
          p[id] === undefined
            ? initialPreferences[id].split(",").map((e) => e.trim())
            : p[id] === ""
              ? []
              : p[id].split(",");

        return {
          ...p,
          [id]: [...existingValues.map((e) => e.trim()), value].join(","),
        };
      });
    } else {
      setPayload((p) => {
        // console.log({ p, initialPreferences });

        return {
          ...p,
          [id]: (p[id] ?? initialPreferences?.[id] ?? "")
            .split(",")
            .map((e) => e.trim())
            .filter((f) => f.trim() !== value.trim())
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
    // console.log({ item, selected });
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
  // console.log("render", { payload });
  return (
    <StyledContainer>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
        }}
      >
        <BrandHeader />

        <StyledCollapsibleHeaderScrollView
          CollapsibleHeaderComponent={
            <View
              style={{
                // flex: 1,
                padding: 20,
                marginTop: 40,
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
                onPress={() => console.log("will send", payload)}
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.secondary,
                  fontSize: 14,
                }}
              >
                Save
              </Button>
            </View>
          }
          headerHeight={110}
          headerContainerBackgroundColor={theme.colors.secondary}
          statusBarHeight={Platform.OS === "ios" ? 20 : 0}
        >
          <PreferencesContainer style={{ paddingInline: 20 }}>
            {preferencesFormConfig
              .filter((f) => f.type === "text")
              .map((f) => (
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
                    // placeholder="Verification Code"
                    value={payload?.[f.id]}
                    defaultValue={initialPreferences?.[f.id] || ""}
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
                </View>
              ))}
            {preferencesFormConfig
              .filter((f) => f.type === "multiselect")
              .map((p) => {
                const data = [...(p.defaultValues || [])];
                if (payload?.[p.id] !== "") {
                  const definedValues =
                    payload?.[p.id] !== undefined
                      ? payload?.[p.id]?.split(",")
                      : initialPreferences?.[p.id]
                          ?.split(",")
                          .map((e) => e.trim()) || [];

                  definedValues.forEach((f) => {
                    if (
                      !data.find(
                        (val) =>
                          val.value.trim().toLowerCase() ===
                          f.trim().toLowerCase(),
                      )
                    ) {
                      data.push({
                        label: capitalize(f),
                        value: f,
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
                            payload?.[p.id]?.split(",") ||
                            initialPreferences?.[p.id]
                              ?.split(",")
                              .map((e) => e.trim()) ||
                            []
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
