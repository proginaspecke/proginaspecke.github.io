import type { CSSProperties } from "react";
import type { TextVariant } from "../types";

export const theme = {
  colors: {
    page: "#f4f7f9",
    surface: "#ffffff",
    surfaceSoft: "#eef4f1",
    border: "#d9e2e0",
    text: "#172321",
    muted: "#66736f",
    accent: "#0f766e",
    accentStrong: "#0b5f59",
    amber: "#b7791f",
    red: "#b42318",
    green: "#027a48",
    blue: "#2563eb",
  },
  textVariants: {
    title: {
      fontSize: "34px",
      lineHeight: "1.08",
      fontWeight: 800,
      color: "#172321",
    },
    heading1: {
      fontSize: "24px",
      lineHeight: "1.18",
      fontWeight: 750,
      color: "#172321",
    },
    heading2: {
      fontSize: "18px",
      lineHeight: "1.25",
      fontWeight: 700,
      color: "#23312e",
    },
    body: {
      fontSize: "14px",
      lineHeight: "1.55",
      fontWeight: 450,
      color: "#35423f",
    },
    caption: {
      fontSize: "12px",
      lineHeight: "1.4",
      fontWeight: 500,
      color: "#66736f",
    },
  } satisfies Record<TextVariant, CSSProperties>,
};
