import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const baseStyle = "px-4 py-2 rounded font-bold transition-colors";
    const variantStyle =
      variant === "primary"
        ? "bg-primary text-white hover:bg-primary/90"
        : "bg-secondary text-slate-800 hover:bg-secondary/90";

    return React.createElement("button", {
      ref,
      className: `${baseStyle} ${variantStyle} ${className || ""}`,
      ...props,
    });
  }
);

CustomButton.displayName = "CustomButton";
