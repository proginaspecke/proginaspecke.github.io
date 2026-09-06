function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((channel) => Math.round(channel).toString(16).padStart(2, "0"))
    .join("")}`;
}

export function interpolateColor(from: string, to: string, ratio: number) {
  const start = hexToRgb(from);
  const end = hexToRgb(to);
  const clamped = Math.max(0, Math.min(1, ratio));

  return rgbToHex(
    start.r + (end.r - start.r) * clamped,
    start.g + (end.g - start.g) * clamped,
    start.b + (end.b - start.b) * clamped,
  );
}
