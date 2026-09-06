import type { TextVariant } from "../types";
import { theme } from "../styles/theme";

interface TextBoxProps {
  text: string;
  variant?: TextVariant;
  className?: string;
}

export function TextBox({ text, variant = "body", className = "" }: TextBoxProps) {
  const Tag = variant === "title" ? "h1" : variant === "body" || variant === "caption" ? "p" : "h2";

  return (
    <Tag
      className={`text-box ${className}`}
      style={theme.textVariants[variant]}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}
