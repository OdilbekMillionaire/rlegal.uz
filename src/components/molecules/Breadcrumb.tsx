import NextLink from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  homeLabel?: string;
  locale: string;
}

export function Breadcrumb({ items, homeLabel = "Home", locale }: BreadcrumbProps) {
  const homeHref = `/${locale}`;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-caption text-ink-muted">
      <NextLink href={homeHref} className="hover:text-blue-action transition-colors">
        {homeLabel}
      </NextLink>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          {item.href ? (
            <NextLink href={item.href} className="hover:text-blue-action transition-colors">
              {item.label}
            </NextLink>
          ) : (
            <span className="text-ink font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
