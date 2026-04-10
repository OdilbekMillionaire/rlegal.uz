"use client";

import { motion } from "framer-motion";
import { Building2, Globe2, FileText, Users, Scale, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import type { Service } from "@/types";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2, Globe2, FileText, Users, Scale,
};

interface ServiceCardProps {
  service: Service;
  title: string;
  description: string;
  learnMore: string;
  index: number;
}

export function ServiceCard({ service, title, description, learnMore, index }: ServiceCardProps) {
  const Icon = ICONS[service.icon] || Building2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group h-full"
    >
      <div className="card h-full flex flex-col p-8">
        {/* Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-pale border border-blue-light/40 rounded-sm group-hover:bg-blue-deep group-hover:border-blue-deep transition-all duration-300">
            <Icon className="w-5 h-5 text-blue-deep group-hover:text-white transition-colors duration-300" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-heading-sm font-bold text-ink mb-3 group-hover:text-blue-deep transition-colors duration-300">
          {title}
        </h3>

        {/* Divider */}
        <div className="w-8 h-0.5 bg-blue-deep mb-4 group-hover:w-14 transition-all duration-400" />

        {/* Description */}
        <p className="text-body-md text-ink-secondary leading-relaxed mb-5 flex-1">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {service.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        {/* Link */}
        <Link
          href={`/services/${service.slug}`}
          className="btn-ghost text-body-sm mt-auto"
        >
          {learnMore}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
