export interface ContactAddress {
  id: "us" | "office" | "hq";
  label: string;
  lines: readonly string[];
  formatted: string;
  schema: {
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode: string;
    addressCountry: string;
  };
}

export const CONTACT_DETAILS = {
  email: "info@protonest.co",
  phone: {
    display: "+94 771 482 755",
    e164: "+94771482755",
    href: "tel:+94771482755",
  },
  addresses: [
    {
      id: "us",
      label: "US Address",
      lines: ["1207 Delaware Avenue, 2549", "Wilmington, DE 19806"],
      formatted: "1207 Delaware Avenue, 2549, Wilmington, DE 19806",
      schema: {
        streetAddress: "1207 Delaware Avenue, 2549",
        addressLocality: "Wilmington",
        addressRegion: "DE",
        postalCode: "19806",
        addressCountry: "US",
      },
    },
    {
      id: "office",
      label: "Office Address",
      lines: ["392 Horana Rd", "Pannipitiya 10132"],
      formatted: "392 Horana Rd, Pannipitiya 10132",
      schema: {
        streetAddress: "392 Horana Rd",
        addressLocality: "Pannipitiya",
        postalCode: "10132",
        addressCountry: "LK",
      },
    },
    {
      id: "hq",
      label: "HQ Address",
      lines: [
        "503/A, Welivita Road",
        "Kaduwela, Colombo, Sri Lanka. 10640",
      ],
      formatted:
        "503/A, Welivita Road, Kaduwela, Colombo, Sri Lanka. 10640",
      schema: {
        streetAddress: "503/A, Welivita Road",
        addressLocality: "Kaduwela",
        addressRegion: "Colombo",
        postalCode: "10640",
        addressCountry: "LK",
      },
    },
  ] satisfies ContactAddress[],
} as const;
