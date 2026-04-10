import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  theme?: "light" | "dark";
}

export function SectionLabel({ children, className, theme = "light" }: SectionLabelProps) {
  return (
    <span
      className={cn(
        "overline flex items-center gap-2",
        theme === "dark" ? "text-blue-light" : "text-blue-action",
        className
      )}
    >
      {children}
    </span>
  );
}
