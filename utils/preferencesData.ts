export type OptionType = {
  label: string;
  value: string;
  selected?: boolean;
};
export const industries: OptionType[] = [
  {
    value: "fashion",
    label: "Fashion",
    selected: true,
  },
  {
    value: "electronics",
    label: "Electronics",
  },
];
export const geographies: OptionType[] = [
  {
    value: "UK",
    label: "UK",
  },
  {
    value: "US",
    label: "US",
  },
];
export const newsSources: OptionType[] = [
  {
    value: "bbc.com",
    label: "bbc.com",
  },
];
export const functions: OptionType[] = [
  {
    value: "ecommerce",
    label: "Ecommerce",
  },
  {
    value: "merchandising",
    label: "Merchandising",
  },
];
export const topics: OptionType[] = [
  {
    value: "marketing",
    label: "Marketing",
  },
  {
    value: "branding",
    label: "Branding",
  },
];
export const brands: OptionType[] = [
  {
    value: "levis",
    label: "Levis",
  },
  {
    value: "puma",
    label: "Puma",
  },
  {
    value: "adidas",
    label: "Adidas",
  },
];
export const preferencesFormConfig = [
  {
    id: "firstName",
    label: "First Name",
    defaultValue: "",
    mandatory: true,
    type: "text",
  },
  {
    id: "email",
    label: "Email ID",
    defaultValue: "",
    mandatory: true,
    type: "text",
    disabled: true,
  },
  {
    id: "company",
    label: "Company Name",
    footnote:
      "We will use this info to prioritise news articles related to your company",
    defaultValue: "",
    mandatory: false,
    type: "text",
  },
  {
    id: "industry",
    label: "Industry Name",
    footnote:
      "Kindly be as specific as possible so we can personalise the news accordingly",
    defaultValue: "",
    mandatory: false,
    type: "text",
  },
  {
    id: "city",
    label: "City you reside in",
    defaultValue: "",
    mandatory: false,
    type: "text",
  },
  {
    id: "industries",
    label: "Industries",
    defaultValues: industries,
    footnote: "We will try to summarise news related to these industries",
    // selectedValues: ["fashion", "electronics"],
    mandatory: true,
    type: "multiselect",
  },
  {
    id: "geographies",
    label: "Geographies",
    defaultValues: geographies,
    footnote:
      "Latest news from your choice of geographical coverage will be summarised for you",
    mandatory: true,
    type: "multiselect",
  },
  {
    id: "news_sources",
    label: "News Sources",
    defaultValues: newsSources,
    footnote: "Please choose/add new options that might be relevant to you",
    mandatory: true,
    type: "multiselect",
  },
  {
    id: "functions",
    label: "Functions",
    defaultValues: functions,
    footnote: "Please choose/add new options that might be relevant to you",
    mandatory: true,
    type: "multiselect",
  },
  {
    id: "topics",
    label: "Topics",
    defaultValues: topics,
    footnote: "Please choose all topics that might be relevant to you",
    mandatory: true,
    type: "multiselect",
  },
  {
    id: "brands",
    label: "Brands",
    footnote:
      "Please choose a few sample brands / retailers that are of interest to you",
    defaultValues: brands,
    mandatory: true,
    type: "multiselect",
  },
];
