import type { CSSProperties } from "react";
import type { TextVariant } from "../types";

export const theme = {
  colors: {
    page: "#f7f5fa",
    surface: "#ffffff",
    surfaceSoft: "#f4eff9",
    border: "#e5deed",
    text: "#241e30",
    muted: "#746d80",
    accent: "#6843a2",
    accentStrong: "#563487",
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
      color: "#241e30",
    },
    heading1: {
      fontSize: "24px",
      lineHeight: "1.18",
      fontWeight: 750,
      color: "#241e30",
    },
    heading2: {
      fontSize: "18px",
      lineHeight: "1.25",
      fontWeight: 700,
      color: "#30283e",
    },
    body: {
      fontSize: "14px",
      lineHeight: "1.55",
      fontWeight: 450,
      color: "#494052",
    },
    caption: {
      fontSize: "12px",
      lineHeight: "1.4",
      fontWeight: 500,
      color: "#746d80",
    },
  } satisfies Record<TextVariant, CSSProperties>,
};
