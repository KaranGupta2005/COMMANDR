export interface ContactNumber {
  label: string;
  number: string;
  description?: string;
}

export interface StateContact {
  state: string;
  stateCode: string;
  contacts: {
    category: string;
    numbers: ContactNumber[];
  }[];
  policies: {
    policy: string;
    plan: string;
  };
}

/* -------------------- NATIONAL CONTACTS -------------------- */

export const nationalContacts: ContactNumber[] = [
  { label: "Emergency (All-in-One)", number: "112", description: "Police, Fire, Ambulance, Disaster" },
  { label: "Police", number: "100" },
  { label: "Fire", number: "101" },
  { label: "Ambulance", number: "108 / 102" },
  { label: "Disaster Management", number: "1078", description: "National" },
  { label: "State Disaster Control", number: "1070" },
  { label: "District Disaster Control", number: "1077" },
  { label: "Women Helpline", number: "1091 / 181" },
  { label: "Child Helpline", number: "1098" },
  { label: "Railway Emergency", number: "139 / 1512" },
  { label: "Road Accident", number: "1073", description: "National Highways" },
];

export const stateContacts: StateContact[] = [
  {
    state: "Andhra Pradesh",
    stateCode: "AP",
    contacts: [
      {
        category: "Disaster Control",
        numbers: [
          { label: "State EOC", number: "1070 / 1800-425-0101" },
          { label: "District Control", number: "1077" },
          { label: "Ambulance", number: "108" },
          { label: "Cyclone/Flood", number: "08645-246600" },
        ],
      },
    ],
    policies: {
      policy: "Andhra Pradesh State Disaster Management Policy",
      plan: "Andhra Pradesh State Disaster Management Plan (SDMP)",
    },
  },
  {
    state: "Arunachal Pradesh",
    stateCode: "AR",
    contacts: [
      {
        category: "Emergency Services",
        numbers: [
          { label: "State Disaster Control", number: "1070 / 0360-2212258" },
          { label: "Police", number: "100 / 0360-2212233" },
          { label: "Ambulance", number: "102 / 108" },
        ],
      },
    ],
    policies: {
      policy: "Arunachal Pradesh State Disaster Management Policy",
      plan: "Arunachal Pradesh State Disaster Management Plan",
    },
  },
  {
    state: "Assam",
    stateCode: "AS",
    contacts: [
      {
        category: "Disaster & Flood Control",
        numbers: [
          { label: "State Disaster Control", number: "1070 / 1079" },
          { label: "Flood Control", number: "0361-2237219 / 0361-2237460" },
          { label: "District Control", number: "1077" },
          { label: "Ambulance (Mrityunjoy)", number: "108" },
        ],
      },
    ],
    policies: {
      policy: "Assam State Disaster Management Policy",
      plan: "Assam State Disaster Management Plan",
    },
  },
  {
    state: "Bihar",
    stateCode: "BR",
    contacts: [
      {
        category: "Disaster Management",
        numbers: [
          { label: "Disaster Management (SEOC)", number: "1070" },
          { label: "Flood/Earthquake Control", number: "0612-2294204 / 0612-2294205" },
          { label: "Police", number: "100 / 112" },
        ],
      },
    ],
    policies: {
      policy: "Bihar State Disaster Management Policy",
      plan: "Bihar State Disaster Management Plan",
    },
  },
  {
    state: "Chhattisgarh",
    stateCode: "CG",
    contacts: [
      {
        category: "Emergency Services",
        numbers: [
          { label: "State Disaster Control", number: "1070 / 0771-2223471" },
          { label: "Ambulance", number: "108" },
          { label: "Mahtari Express (Pregnant Women)", number: "102" },
        ],
      },
    ],
    policies: {
      policy: "Chhattisgarh State Disaster Management Policy",
      plan: "Chhattisgarh State Disaster Management Plan",
    },
  },
  {
    state: "Delhi",
    stateCode: "DL",
    contacts: [
      {
        category: "Disaster & Emergency",
        numbers: [
          { label: "Disaster Management", number: "1077" },
          { label: "Control Room", number: "011-23831077" },
          { label: "Flood Control (Yamuna)", number: "011-22051234" },
          { label: "Fire", number: "101" },
        ],
      },
    ],
    policies: {
      policy: "Delhi Disaster Management Policy",
      plan: "Delhi Disaster Management Plan",
    },
  },
  {
    state: "Goa",
    stateCode: "GA",
    contacts: [
      {
        category: "Emergency Services",
        numbers: [
          { label: "Disaster Management", number: "1070 / 1077" },
          { label: "Control Room", number: "0832-2419550" },
          { label: "Ambulance", number: "108" },
        ],
      },
    ],
    policies: {
      policy: "Goa State Disaster Management Policy",
      plan: "Goa State Disaster Management Plan",
    },
  },
  {
    state: "Gujarat",
    stateCode: "GJ",
    contacts: [
      {
        category: "Disaster Control",
        numbers: [
          { label: "State Disaster Control (SEOC)", number: "1070" },
          { label: "Emergency Response", number: "079-23251900 / 079-23251902" },
          { label: "Cyclone/Flood Helpline", number: "1077" },
          { label: "Earthquake Helpline", number: "1070" },
        ],
      },
    ],
    policies: {
      policy: "Gujarat State Disaster Management Policy (GSDMP)",
      plan: "Gujarat State Disaster Management Plan 2024–25",
    },
  },
  {
    state: "Haryana",
    stateCode: "HR",
    contacts: [
      {
        category: "Emergency Services",
        numbers: [
          { label: "State Disaster Control", number: "1070" },
          { label: "Control Room", number: "0172-2545938" },
          { label: "Flood Control", number: "1077" },
        ],
      },
    ],
    policies: {
      policy: "Haryana State Disaster Management Policy",
      plan: "Haryana State Disaster Management Plan (HSDMP) 2016",
    },
  },
  {
    state: "Himachal Pradesh",
    stateCode: "HP",
    contacts: [
      {
        category: "Disaster & Emergency",
        numbers: [
          { label: "State Disaster Control", number: "1070" },
          { label: "Landslide/Flood Control", number: "0177-2926968 / 0177-2628940" },
          { label: "District Helpline", number: "1077" },
          { label: "Gudiya Helpline (Women)", number: "1515" },
          { label: "Hoshiyar Singh (Forest/Drug)", number: "1090" },
        ],
      },
    ],
    policies: {
      policy: "Himachal Pradesh State Disaster Management Policy",
      plan: "Himachal Pradesh State Disaster Management Plan",
    },
  },
  {
    state: "Jammu & Kashmir",
    stateCode: "JK",
    contacts: [
      {
        category: "Disaster Management",
        numbers: [
          { label: "Disaster Management (Jammu)", number: "0191-2560461" },
          { label: "Disaster Management (Srinagar)", number: "0194-2452295" },
          { label: "Flood Control", number: "1070" },
        ],
      },
    ],
    policies: {
      policy: "Jammu & Kashmir Disaster Management Policy",
      plan: "Jammu & Kashmir Disaster Management Plan",
    },
  },
  {
    state: "Jharkhand",
    stateCode: "JH",
    contacts: [
      {
        category: "Emergency Services",
        numbers: [
          { label: "State Disaster Control", number: "1070" },
          { label: "Control Room", number: "0651-2403918" },
          { label: "Police", number: "100 / 112" },
        ],
      },
    ],
    policies: {
      policy: "Jharkhand State Disaster Management Policy",
      plan: "Jharkhand State Disaster Management Plan",
    },
  },
  {
    state: "Karnataka",
    stateCode: "KA",
    contacts: [
      {
        category: "Disaster Control",
        numbers: [
          { label: "State Disaster Control", number: "1070" },
          { label: "Natural Disaster Monitoring", number: "080-22340676" },
          { label: "Bangalore Emergency", number: "100 / 112" },
          { label: "Ambulance", number: "108" },
        ],
      },
    ],
    policies: {
      policy: "Karnataka State Disaster Management Policy (Revised 2020)",
      plan: "Karnataka State Disaster Management Plan",
    },
  },
  {
    state: "Kerala",
    stateCode: "KL",
    contacts: [
      {
        category: "Emergency Operations",
        numbers: [
          { label: "State EOC", number: "1079 / 0471-2364424" },
          { label: "Disaster Control", number: "1070 / 0471-2331639" },
          { label: "District Control (Floods)", number: "1077" },
          { label: "Ambulance", number: "108" },
          { label: "Disha (Health)", number: "1056" },
        ],
      },
    ],
    policies: {
      policy: "Kerala State Disaster Management Policy",
      plan: "Kerala State Disaster Management Plan (KSDMP) 2016 (updated)",
    },
  },
  {
    state: "Madhya Pradesh",
    stateCode: "MP",
    contacts: [
      {
        category: "Disaster Management",
        numbers: [
          { label: "State Disaster Control", number: "1070 / 1079" },
          { label: "Control Room", number: "0755-2441419" },
          { label: "Ambulance", number: "108" },
        ],
      },
    ],
    policies: {
      policy: "Madhya Pradesh State Disaster Management Policy",
      plan: "Madhya Pradesh State Disaster Management Plan (SDMP)",
    },
  },
  {
    state: "Maharashtra",
    stateCode: "MH",
    contacts: [
      {
        category: "Control Rooms",
        numbers: [
          { label: "State Control (Mantralaya)", number: "022-22027990" },
          { label: "BMC Disaster (Mumbai)", number: "1916" },
          { label: "District Control", number: "1077" },
          { label: "Ambulance", number: "108" },
        ],
      },
    ],
    policies: {
      policy: "Maharashtra State Disaster Management Policy",
      plan: "Maharashtra State Disaster Management Plan (SDMP) 2023",
    },
  },
  {
    state: "Manipur",
    stateCode: "MN",
    contacts: [
      {
        category: "Emergency Services",
        numbers: [
          { label: "State Disaster Control (SEOC)", number: "1070 / 0385-2443441" },
          { label: "Relief & Disaster (Imphal)", number: "0385-2450038" },
          { label: "Police/Fire/Ambulance (ERSS)", number: "112" },
        ],
      },
    ],
    policies: {
      policy: "Manipur State Disaster Management Policy",
      plan: "Manipur State Disaster Management Plan",
    },
  },
  {
    state: "Meghalaya",
    stateCode: "ML",
    contacts: [
      {
        category: "Disaster Control",
        numbers: [
          { label: "State Disaster Control", number: "1070" },
          { label: "Control Room", number: "0364-2502098 / 0364-2226578" },
          { label: "DM Director", number: "0364-22204849" },
          { label: "Police", number: "100 / 112" },
        ],
      },
    ],
    policies: {
      policy: "Meghalaya State Disaster Management Policy",
      plan: "Meghalaya State Disaster Management Plan",
    },
  },
  {
    state: "Mizoram",
    stateCode: "MZ",
    contacts: [
      {
        category: "Emergency Services",
        numbers: [
          { label: "State Disaster Control", number: "1070 / 0389-2342520" },
          { label: "District Control (Aizawl)", number: "1077 / 0389-2345943" },
          { label: "DM Directorate", number: "0389-2335837" },
          { label: "Women Helpline", number: "181" },
        ],
      },
    ],
    policies: {
      policy: "Mizoram State Disaster Management Policy",
      plan: "Mizoram State Disaster Management Plan",
    },
  },
  {
    state: "Nagaland",
    stateCode: "NL",
    contacts: [
      {
        category: "Disaster Control",
        numbers: [
          { label: "State EOC (SEOC)", number: "1070 / 0370-2291122" },
          { label: "NSDMA Office", number: "0370-2270050" },
          { label: "District Control (DEOC)", number: "1077" },
          { label: "Fax", number: "0370-2291123" },
        ],
      },
    ],
    policies: {
      policy: "Nagaland State Disaster Management Policy",
      plan: "Nagaland State Disaster Management Plan",
    },
  },
  {
    state: "Odisha",
    stateCode: "OR",
    contacts: [
      {
        category: "Emergency Operations",
        numbers: [
          { label: "State EOC", number: "1070" },
          { label: "Cyclone/Flood Helpline", number: "0674-2534177" },
          { label: "District Control", number: "1077" },
          { label: "BMC (Cyclone)", number: "1929" },
        ],
      },
    ],
    policies: {
      policy: "Odisha State Disaster Management Policy",
      plan: "Odisha State Disaster Management Plan",
    },
  },
  {
    state: "Punjab",
    stateCode: "PB",
    contacts: [
      {
        category: "Emergency Services",
        numbers: [
          { label: "Disaster Control", number: "0172-2749051" },
          { label: "Police", number: "112" },
          { label: "Ambulance", number: "108" },
        ],
      },
    ],
    policies: {
      policy: "Punjab State Disaster Management Policy",
      plan: "Punjab State Disaster Management Plan",
    },
  },
  {
    state: "Rajasthan",
    stateCode: "RJ",
    contacts: [
      {
        category: "Disaster Management",
        numbers: [
          { label: "State Control", number: "1070" },
          { label: "Flood/Relief", number: "0141-2227296" },
          { label: "Ambulance", number: "108" },
        ],
      },
    ],
    policies: {
      policy: "Rajasthan State Disaster Management Policy",
      plan: "Rajasthan State Disaster Management Plan",
    },
  },
  {
    state: "Sikkim",
    stateCode: "SK",
    contacts: [
      {
        category: "Disaster Control",
        numbers: [
          { label: "State Disaster Control", number: "1070 / 03592-202664" },
          { label: "Land Revenue & DM", number: "03592-201145" },
          { label: "Rural Disaster (Monsoon)", number: "76026-73187" },
          { label: "Collector (West)", number: "9434122222" },
          { label: "Roads & Bridges (Landslides)", number: "9733076757" },
        ],
      },
    ],
    policies: {
      policy: "Sikkim State Disaster Management Policy",
      plan: "Sikkim State Disaster Management Plan",
    },
  },
  {
    state: "Tamil Nadu",
    stateCode: "TN",
    contacts: [
      {
        category: "Emergency Services",
        numbers: [
          { label: "State Disaster Helpline", number: "1070" },
          { label: "Chennai Corp (Flood/Trees)", number: "1913" },
          { label: "District Helpline", number: "1077" },
          { label: "Electricity (TANGEDCO)", number: "1912 / 94987 94987" },
          { label: "Snake Rescue (Chennai)", number: "044-22200335" },
        ],
      },
    ],
    policies: {
      policy: "Tamil Nadu State Disaster Management Policy",
      plan: "Tamil Nadu State Disaster Management Plan",
    },
  },
  {
    state: "Telangana",
    stateCode: "TG",
    contacts: [
      {
        category: "Disaster Control",
        numbers: [
          { label: "State Disaster Control", number: "1070" },
          { label: "GHMC (Hyderabad)", number: "040-21111111" },
          { label: "Ambulance", number: "108" },
        ],
      },
    ],
    policies: {
      policy: "Telangana State Disaster Management Policy",
      plan: "Telangana State Disaster Management Plan",
    },
  },
  {
    state: "Tripura",
    stateCode: "TR",
    contacts: [
      {
        category: "Emergency Services",
        numbers: [
          { label: "State Disaster Control", number: "1070 / 0381-2416045" },
          { label: "District Control", number: "1077" },
          { label: "West Tripura Emergency", number: "0381-2322971" },
          { label: "North Tripura Emergency", number: "03822-234349" },
          { label: "Fire Service", number: "101 / 2326666" },
        ],
      },
    ],
    policies: {
      policy: "Tripura State Disaster Management Policy",
      plan: "Tripura State Disaster Management Plan",
    },
  },
  {
    state: "Uttar Pradesh",
    stateCode: "UP",
    contacts: [
      {
        category: "Disaster Management",
        numbers: [
          { label: "State Disaster Control", number: "1070" },
          { label: "Relief Commissioner", number: "0522-2238200" },
          { label: "Police (UP 112)", number: "112" },
          { label: "Ambulance", number: "108 / 102" },
        ],
      },
    ],
    policies: {
      policy: "Uttar Pradesh State Disaster Management Policy",
      plan: "Uttar Pradesh State Disaster Management Plan",
    },
  },
  {
    state: "Uttarakhand",
    stateCode: "UK",
    contacts: [
      {
        category: "Disaster & Emergency",
        numbers: [
          { label: "State Disaster Control", number: "1070" },
          { label: "Landslide/Flood Control", number: "0135-2710334 / 9557444486" },
          { label: "Char Dham Yatra Helpline", number: "1364" },
        ],
      },
    ],
    policies: {
      policy: "Uttarakhand State Disaster Management Policy",
      plan: "Uttarakhand State Disaster Management Plan",
    },
  },
  {
    state: "West Bengal",
    stateCode: "WB",
    contacts: [
      {
        category: "Control Rooms",
        numbers: [
          { label: "State Control (Nabanna)", number: "1070 / 033-22143526" },
          { label: "Kolkata Police (Cyclone)", number: "033-22143024" },
          { label: "Ambulance", number: "102" },
        ],
      },
    ],
    policies: {
      policy: "West Bengal State Disaster Management Policy",
      plan: "West Bengal State Disaster Management Plan",
    },
  },
  {
    state: "Andaman & Nicobar Islands",
    stateCode: "AN",
    contacts: [
      {
        category: "Disaster & Coast Guard",
        numbers: [
          { label: "Disaster Control", number: "1070 / 03192-234287" },
          { label: "Cyclone & Tsunami", number: "1077 / 03192-245555" },
          { label: "Police Control", number: "100 / 03192-238258" },
          { label: "Shipping Emergency", number: "03192-245555" },
          { label: "Coast Guard (SAR)", number: "1554" },
        ],
      },
    ],
    policies: {
      policy: "A&N Islands Disaster Management Policy",
      plan: "A&N Islands Disaster Management Plan",
    },
  },
  {
    state: "Chandigarh",
    stateCode: "CH",
    contacts: [
      {
        category: "Emergency Services",
        numbers: [
          { label: "Disaster Management", number: "1077 / 112" },
          { label: "Police Control", number: "100" },
          { label: "Fire", number: "101 / 0172-2702333" },
          { label: "PGI Emergency", number: "0172-2747005" },
          { label: "Electricity", number: "0172-2703242" },
        ],
      },
    ],
    policies: {
      policy: "Chandigarh Disaster Management Policy",
      plan: "Chandigarh Disaster Management Plan",
    },
  },
  {
    state: "Dadra & Nagar Haveli and Daman & Diu",
    stateCode: "DD",
    contacts: [
      {
        category: "Emergency Services",
        numbers: [
          { label: "Disaster Control", number: "1077 / 0260-2231377" },
          { label: "Police", number: "100" },
          { label: "Fire", number: "101" },
          { label: "Coast Guard", number: "1554" },
        ],
      },
    ],
    policies: {
      policy: "DNHD&D Disaster Management Policy",
      plan: "DNHD&D Disaster Management Plan",
    },
  },
  {
    state: "Ladakh",
    stateCode: "LA",
    contacts: [
      {
        category: "Disaster Control",
        numbers: [
          { label: "Divisional Commissioner", number: "01982-255567" },
          { label: "Police Control", number: "112 / 100" },
          { label: "District Control (Leh)", number: "01982-257416" },
        ],
      },
    ],
    policies: {
      policy: "Ladakh Disaster Management Policy",
      plan: "Ladakh Disaster Management Plan",
    },
  },
  {
    state: "Lakshadweep",
    stateCode: "LD",
    contacts: [
      {
        category: "Emergency & Sea Rescue",
        numbers: [
          { label: "Disaster Control", number: "1070 / 04896-262356" },
          { label: "Police", number: "100" },
          { label: "Sea Rescue (Coast Guard)", number: "1554" },
        ],
      },
    ],
    policies: {
      policy: "Lakshadweep Disaster Management Policy",
      plan: "Lakshadweep Disaster Management Plan",
    },
  },
  {
    state: "Puducherry",
    stateCode: "PY",
    contacts: [
      {
        category: "Emergency Operations",
        numbers: [
          { label: "State EOC", number: "1070 / 1077" },
          { label: "Control Room", number: "0413-2253407 / 0413-2251003" },
          { label: "Fire Service", number: "101" },
          { label: "Women Helpline", number: "1091" },
        ],
      },
    ],
    policies: {
      policy: "Puducherry Disaster Management Policy",
      plan: "Puducherry Disaster Management Plan",
    },
  },
];

export const nationalPolicies = [
  {
    title: "Disaster Management Act, 2005",
    description:
      "Main law for disasters in India. Creates NDMA, SDMAs, DDMAs and NDRF for specialized response.",
  },
  {
    title: "National Policy on Disaster Management (NPDM), 2009",
    description:
      "Shifts focus from relief-only to prevention, mitigation, preparedness, response and recovery.",
  },
  {
    title: "National Disaster Management Plan (NDMP)",
    description:
      "Operational plan aligned with the Sendai Framework, covering all phases and ministries.",
  },
  {
    title: "NDRF & SDRF Financing Framework (2021–26)",
    description:
      "Guidelines for disaster funding and National/State Disaster Response Fund allocation.",
  },
  {
    title: "National Guidelines for EOCs",
    description:
      "Standardizes emergency operations centers with 24×7 coordination systems.",
  },
  {
    title: "National Guidelines on Community-Based DRR",
    description:
      "Promotes village- and ward-level disaster planning and volunteer programs.",
  },
  {
    title: "National Guidelines on Mental Health & Psychosocial Support",
    description:
      "Integrates mental health and counselling into disaster response.",
  },
  {
    title: "National Guidelines on International HADR",
    description:
      "Regulates India’s international disaster relief and foreign assistance.",
  },
  {
    title: "National Guidelines on NDMICS",
    description:
      "Defines national IT backbone and integrated early warning systems.",
  },
  {
    title: "National Guidelines on Minimum Standards of Relief",
    description:
      "Defines minimum norms for food, water, shelter and healthcare.",
  },
];