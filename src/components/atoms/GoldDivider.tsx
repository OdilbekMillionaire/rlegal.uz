import { cn } from "@/lib/utils";

interface DividerProps {
  className?: string;
  width?: "sm" | "md" | "lg" | "full";
  align?: "left" | "center" | "right";
  theme?: "blue" | "dark" | "white";
}

const widthMap = { sm: "w-10", md: "w-16", lg: "w-24", full: "w-full" };
const alignMap = { left: "mr-auto", center: "mx-auto", right: "ml-auto" };
const colorMap = { blue: "bg-blue-deep", dark: "bg-ink", white: "bg-white" };

export function GoldDivider({
  className,
  width = "md",
  align = "left",
  theme = "blue",
}: DividerProps) {
  return (
    <div
      className={cn(
        "h-0.5 rounded-full",
        widthMap[width],
        alignMap[align],
        colorMap[theme],
        className
      )}
    />
  );
}
