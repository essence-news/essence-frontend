export type OptionType = {
  label: string;
  value: string;
  selected?: boolean;
};
export const industries: OptionType[] = [
  {
    value: "fashion",
    label: "Fashion",
  },
  {
    value: "electronics",
    label: "Electronics",
  },
  {
    value: "grocery",
    label: "Grocery",
  },
  {
    value: "luxury",
    label: "Luxury",
  },
  {
    value: "beauty",
    label: "Beauty",
  },
  {
    value: "health and wellness",
    label: "Health and Wellness",
  },
  {
    value: "automotive",
    label: "Automotive",
  },
  {
    value: "sports and outdoors",
    label: "Sports and Outdoors",
  }
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
  {
    value: "europe",
    label: "Europe",
  },
  {
    value: "asia",
    label: "Asia",
  },
  {
    value: "india",
    label: "India",
  },
  {
    value: "middle_east",
    label: "Middle East",
  },
  {
    value: "africa",
    label: "Africa",
  },
  {
    value: "latin_america",
    label: "Latin America",
  },
];
export const newsSources: OptionType[] = [
  {
    value: "retaildive.com",
    label: "retaildive.com",
  },
  {
    value: "retail-week.com",
    label: "retail-week.com",
  },
  {
    value: "retailgazette.co.uk",
    label: "retailgazette.co.uk",
  },
  {
    value: "businessoffashion.com",
    label: "businessoffashion.com",
  },
  {
    value: "vogue.co.uk",
    label: "vogue.co.uk",
  },
  {
    value: "sneakernews.com",
    label: "sneakernews.com",
  },
  {
    value: "just-style.com",
    label: "just-style.com",
  },
  {
    value: "thegrocer.co.uk",
    label: "thegrocer.co.uk",
  },
  {
    value: "grocerydive.com",
    label: "grocerydive.com",
  },
  {
    value: "ecommercebytes.com",
    label: "ecommercebytes.com",
  },
  {
    value: "ecommercetimes.com",
    label: "ecommercetimes.com",
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
  {
    value: "sales",
    label: "Sales",
  },
  {
    value: "marketing",
    label: "Marketing",
  },
  {
    value: "supply chain and logistics",
    label: "Supply Chain & Logistics",
  },
  {
    value: "technology",
    label: "Technology",
  },
  {
    value: "finance and human resources",
    label: "Finance & HR",
  },
];
export const topics: OptionType[] = [
  {
    value: "ecommerce",
    label: "Ecommerce",
  },
  {
    value: "merchandising",
    label: "Merchandising",
  },
  {
    value: "marketing",
    label: "Marketing",
  },
  {
    value: "branding",
    label: "Branding",
  },
  {
    value: "leadership_changes",
    label: "Leadership changes",
  },
  {
    value: "mergers_and_acquisitions",
    label: "Mergers and Acquisitions",
  },
  {
    value: "jobs",
    label: "Jobs",
  },
  {
    value: "retail_innovation",
    label: "Retail Innovation",
  },
  {
    value: "supply_chain",
    label: "Supply Chain",
  },
];
export const brands: OptionType[] = [
  {
    value: "levis",
    label: "Levis",
  },
  {
    value: "nike",
    label: "Nike",
  },
  {
    value: "john_lewis",
    label: "John Lewis",
  },
  {
    value: "m&s",
    label: "M&S",
  },
  {
    value: "amazon",
    label: "Amazon",
  },
  {
    value: "asos",
    label: "ASOS",
  },
];
export const preferencesFormConfig = [
  {
    id: "first_name",
    label: "How do we address you?",
    placeholder: "Your first name",
    defaultValue: "",
    mandatory: true,
    type: "text",
    dynamic: false,
  },
  {
    id: "email",
    label: "Your email ID",
    placeholder: "abc@xyz.com",
    defaultValue: "",
    mandatory: true,
    type: "text",
    disabled: true,
    dynamic: true,
  },
  {
    id: "industry",
    label: "Which industry do you work in?",
    footnote:
      "Helps us fetch your industry relevant topics",
    placeholder: "ex. Fashion, Electronics, etc.",
    defaultValue: "",
    mandatory: true,
    type: "text",
    dynamic: true,
  },
  {
    id: "function",
    label: "Which function best describes your role?",
    footnote:
      "We will use this information to tailor news and updates relevant to your area of expertise.",
    placeholder: "ex. Ecommerce, Merchandising, etc.",
    defaultValue: "",
    mandatory: true,
    type: "text",
    dynamic: true,
  },
  {
    id: "company",
    label: "Where do you work?",
    footnote:
      "We will prioritize news about your company and competition in your essence briefs",
    placeholder: "Your company name",
    defaultValue: "",
    mandatory: false,
    type: "text",
    dynamic: true,
  },
  {
    id: "country_name",
    label: "Where are you located?",
    footnote: "We will prioritize news from your country / region",
    placeholder: "ex. UK, Europe, etc.",
    defaultValue: "",
    mandatory: false,
    type: "text",
    dynamic: true,
  },
  {
    id: "news_sources",
    label: "What are your favorite sources for industry news?",
    addNewLabel: "Add new sources",
    defaultValues: newsSources,
    placeholder: "ex. retaildive.com, retail-week.com, etc.",
    footnote: "We will ensure that you never miss out on articles from these sources (blogs, news sites etc.) ",
    mandatory: false,
    type: "multiselect",
    dynamic: false,
  },
  {
    id: "brands",
    label: "Which companies do you want to keep an eye on?",
    addNewLabel: "Add new brands",
    footnote:
      "We will help you stay updated on news about these companies",
    defaultValues: brands,
    placeholder: "ex. Levis, Nike, John Lewis, etc.",
    mandatory: false,
    type: "multiselect",
    dynamic: true,
  },
  {
    id: "industries",
    label: "Are there other industries you’re interested in?",
    addNewLabel: "Add new industries",
    defaultValues: industries,
    placeholder: "ex. Fashion, Electronics, etc.",
    footnote: "Retail innovation happens across industries. We’ll include cross-industry updates that may interest you.",
    // selectedValues: ["fashion", "electronics"],
    mandatory: false,
    type: "multiselect",
    dynamic: true,
  },
  {
    id: "geographies",
    label: "Other Geographies on your watchlist?",
    addNewLabel: "Add new geographies",
    defaultValues: geographies,
    placeholder: "ex. UK, Europe, etc.",
    footnote:
      "We’ll scan these regions for relevant news",
    mandatory: false,
    type: "multiselect",
    dynamic: true,
  },
  {
    id: "topics",
    label: "What topics are you interested in?",
    addNewLabel: "Add new topics",
    defaultValues: topics,
    placeholder: "ex. eCommerce, Marketing, Leadership changes, M&A, Jobs, etc.",
    footnote: "We’ll prioritize updates on these topics in your newsfeed",
    mandatory: false,
    type: "multiselect",
    dynamic: true,
  }
  // {
  //   id: "functions",
  //   label: "Functions",
  //   defaultValues: functions,
  //   footnote: "Please choose/add new options that might be relevant to you",
  //   mandatory: false,
  //   type: "multiselect",
  //   dynamic: true,
  // },

];
