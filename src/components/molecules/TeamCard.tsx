"use client";

import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TeamMember, Locale } from "@/types";
import { useLocale } from "next-intl";

interface TeamCardProps {
  member: TeamMember;
  yearsExpLabel: string;
  admittedLabel: string;
  languagesLabel: string;
  index: number;
}

export function TeamCard({ member, yearsExpLabel, admittedLabel, languagesLabel, index }: TeamCardProps) {
  const locale = useLocale() as Locale;

  const role =
    locale === "ru" ? member.roleRu
    : locale === "uz" || locale === "uz-cyrl" ? member.roleUz
    : member.role;

  const initials = member.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div className="card overflow-hidden h-full">
        {/* Blue top accent on hover */}
        <div className="h-1 bg-blue-deep w-0 group-hover:w-full transition-all duration-500" />

        <div className="p-7">
          {/* Avatar + name */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-sm bg-blue-pale border border-blue-light/40 flex items-center justify-center flex-shrink-0">
              <span className="font-sans text-xl font-bold text-blue-deep">{initials}</span>
            </div>
            <div className="min-w-0 pt-1">
              <h3 className="text-heading-sm font-bold text-ink leading-snug">{member.name}</h3>
              <p className="text-body-sm text-blue-action font-medium mt-0.5">{role}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            <div className="bg-cream border border-stone rounded-sm p-3 text-center">
              <div className="text-display-sm font-bold text-blue-deep">{member.yearsExp}</div>
              <div className="text-caption text-ink-muted leading-snug mt-0.5">{yearsExpLabel}</div>
            </div>
            <div className="bg-cream border border-stone rounded-sm p-3">
              <div className="text-caption text-ink-muted uppercase tracking-wider mb-1.5">{languagesLabel}</div>
              <div className="flex flex-wrap gap-1">
                {member.languages.map((lang) => (
                  <span key={lang} className="text-caption font-bold text-blue-deep bg-blue-pale border border-blue-light/30 px-1.5 py-0.5 rounded-sm">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="mb-4">
            <div className="text-caption text-ink-muted uppercase tracking-wider mb-2 font-semibold">Education</div>
            {member.education.map((edu) => (
              <div key={edu} className="flex items-start gap-1.5 mb-1">
                <span className="text-blue-action text-body-sm mt-0.5 flex-shrink-0">›</span>
                <span className="text-body-sm text-ink-secondary">{edu}</span>
              </div>
            ))}
          </div>

          {/* Admitted */}
          <div className="mb-4">
            <div className="text-caption text-ink-muted uppercase tracking-wider mb-1.5 font-semibold">{admittedLabel}</div>
            <p className="text-body-sm text-ink-secondary">{member.admittedIn.join(" · ")}</p>
          </div>

          {/* Bio */}
          <p className="text-body-sm text-ink-secondary leading-relaxed line-clamp-3 mb-5">{member.bio}</p>

          {/* LinkedIn */}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-body-sm text-ink-muted hover:text-blue-action transition-colors duration-200"
            >
              <Linkedin className="w-3.5 h-3.5" />
              LinkedIn Profile
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
