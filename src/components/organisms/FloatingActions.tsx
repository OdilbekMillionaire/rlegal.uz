"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Scale, Phone, Mail, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { usePathname } from "@/i18n/navigation";

export function FloatingActions() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const pathname = usePathname();

  // Hide on AI advisor page (it has its own full UI)
  if (pathname === "/ai-advisor") return null;

  const actions = [
    {
      icon: Scale,
      label: t("aiAdvisor"),
      href: "/ai-advisor" as const,
      color: "bg-blue-deep hover:bg-blue-action text-white",
    },
    {
      icon: Phone,
      label: "+998 90 825 08 78",
      href: "tel:+998908250878" as const,
      color: "bg-white hover:bg-cream text-ink border border-stone",
      external: true,
    },
    {
      icon: Mail,
      label: "rlegalpractice@gmail.com",
      href: "mailto:rlegalpractice@gmail.com" as const,
      color: "bg-white hover:bg-cream text-ink border border-stone",
      external: true,
    },
    {
      icon: Send,
      label: "Telegram",
      href: "https://t.me/rlegalpractice" as const,
      color: "bg-[#229ED9] hover:bg-[#1a8bbf] text-white",
      external: true,
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <>
            {actions.map((action, i) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 12, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.9 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <span className="bg-ink text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap max-w-[180px] truncate">
                  {action.label}
                </span>
                {action.external ? (
                  <a href={action.href} target="_blank" rel="noopener noreferrer"
                    className={cn("w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 flex-shrink-0", action.color)}>
                    <action.icon className="w-4.5 h-4.5" />
                  </a>
                ) : (
                  <Link href={action.href as "/ai-advisor"}
                    onClick={() => setOpen(false)}
                    className={cn("w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 flex-shrink-0", action.color)}>
                    <action.icon className="w-4.5 h-4.5" />
                  </Link>
                )}
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileTap={{ scale: 0.92 }}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300",
          open
            ? "bg-ink text-white rotate-0"
            : "bg-blue-deep text-white shadow-[0_0_20px_rgba(0,87,255,0.4)]"
        )}
        aria-label="Contact options"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageSquare className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
