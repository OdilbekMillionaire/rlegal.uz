import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon";
  size?: "sm" | "md" | "lg";
  /** "light" = dark ink on cream bg (header), "dark" = white on dark bg (footer) */
  theme?: "light" | "dark";
}

export function Logo({ className, variant = "full", size = "md", theme = "light" }: LogoProps) {
  const sizes = { sm: 28, md: 34, lg: 44 };
  const s = sizes[size];
  const blue = "#0f2ccf";
  const gold = "#C9A96E";
  const textColor = theme === "dark" ? "#ffffff" : "#151414";
  const subtextColor = theme === "dark" ? "rgba(255,255,255,0.45)" : "#6b6a69";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Mark: Geometric R stamp */}
      <svg
        width={s}
        height={s}
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Background square */}
        <rect x="0" y="0" width="38" height="38" rx="4" fill={blue} />

        {/* Gold accent bar — bottom strip */}
        <rect x="0" y="30" width="38" height="8" rx="0" fill={gold} />
        {/* Round just the bottom two corners */}
        <rect x="0" y="30" width="38" height="5" fill={gold} />
        <rect x="0" y="33" width="38" height="5" rx="4" fill={gold} />

        {/* White R letterform */}
        <path
          d="M9 7 L9 26 M9 7 L21 7 Q27 7 27 13.5 Q27 20 21 20 L9 20 M17.5 20 L26 26"
          stroke="white"
          strokeWidth="3.8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {variant === "full" && (
        <div className="flex flex-col leading-none gap-[3px]">
          <span
            className="font-sans font-bold"
            style={{
              fontSize: size === "sm" ? 14 : size === "md" ? 17 : 21,
              color: textColor,
              letterSpacing: "-0.02em",
            }}
          >
            R-LEGAL
          </span>
          <span
            className="font-sans font-medium tracking-[0.14em] uppercase"
            style={{
              fontSize: size === "sm" ? 7.5 : size === "md" ? 8.5 : 10.5,
              color: subtextColor,
            }}
          >
            PRACTICE
          </span>
        </div>
      )}
    </div>
  );
}
