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
    value: "uk",
    label: "UK",
  },
  {
    value: "us",
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
    id: "first_name",
    label: "First Name",
    defaultValue: "",
    mandatory: true,
    type: "text",
    dynamic: false,
  },
  {
    id: "email",
    label: "Email ID",
    defaultValue: "",
    mandatory: true,
    type: "text",
    disabled: true,
    dynamic: true,
  },
  {
    id: "industry",
    label: "Industry Name",
    footnote:
      "Kindly be as specific as possible so we can personalise the news accordingly",
    defaultValue: "",
    mandatory: false,
    type: "text",
    dynamic: true,
  },
  {
    id: "company",
    label: "Company Name",
    footnote:
      "We will use this info to prioritise news articles related to your company",
    defaultValue: "",
    mandatory: false,
    type: "text",
    dynamic: true,
  },
  {
    id: "city",
    label: "City you reside in",
    defaultValue: "",
    mandatory: false,
    type: "text",
    dynamic: true,
  },
  {
    id: "industries",
    label: "Industries",
    defaultValues: industries,
    footnote: "We will try to summarise news related to these industries",
    // selectedValues: ["fashion", "electronics"],
    mandatory: false,
    type: "multiselect",
    dynamic: true,
  },
  {
    id: "geographies",
    label: "Geographies",
    defaultValues: geographies,
    footnote:
      "Latest news from your choice of geographical coverage will be summarised for you",
    mandatory: false,
    type: "multiselect",
    dynamic: true,
  },
  {
    id: "news_sources",
    label: "News Sources",
    defaultValues: newsSources,
    footnote: "Please choose/add new options that might be relevant to you",
    mandatory: false,
    type: "multiselect",
    dynamic: false,
  },
  {
    id: "functions",
    label: "Functions",
    defaultValues: functions,
    footnote: "Please choose/add new options that might be relevant to you",
    mandatory: false,
    type: "multiselect",
    dynamic: true,
  },
  {
    id: "topics",
    label: "Topics",
    defaultValues: topics,
    footnote: "Please choose all topics that might be relevant to you",
    mandatory: false,
    type: "multiselect",
    dynamic: true,
  },
  {
    id: "brands",
    label: "Brands",
    footnote:
      "Please choose a few sample brands / retailers that are of interest to you",
    defaultValues: brands,
    mandatory: false,
    type: "multiselect",
    dynamic: true,
  },
];
