"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { CONTACT_INFO, SERVICES } from "@/lib/constants";
import type { ContactFormData } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().optional(),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(20, "Please provide at least 20 characters"),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const t = useTranslations("contact");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Submission failed");
      }
      setSuccess(true);
      reset();
      toast.success(t("form.success"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please email us directly.");
    }
  };

  const INFO_ITEMS = [
    {
      icon: Phone,
      label: t("form.phone"),
      value: CONTACT_INFO.phone,
      href: `tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`,
    },
    {
      icon: Mail,
      label: t("form.email"),
      value: CONTACT_INFO.email,
      href: `mailto:${CONTACT_INFO.email}`,
    },
    {
      icon: MapPin,
      label: "Address",
      value: "Tashkent, Republic of Uzbekistan",
      href: undefined,
    },
    {
      icon: Clock,
      label: "Office Hours",
      value: CONTACT_INFO.hours,
      href: undefined,
    },
  ];

  return (
    <main className="min-h-screen bg-cream pt-[108px]">
      {/* Header */}
      <section className="bg-white border-b border-stone">
        <div className="site-container py-14">
          <SectionLabel className="mb-4">{t("title")}</SectionLabel>
          <h1
            className="font-sans font-bold text-ink mb-4 leading-tight"
            style={{ fontSize: "clamp(32px, 4.5vw, 56px)", letterSpacing: "-0.025em" }}
          >
            {t("title")}
          </h1>
          <div className="w-10 h-0.5 bg-blue-deep mb-5" />
          <p className="text-body-lg text-ink-secondary max-w-2xl">{t("subtitle")}</p>
        </div>
      </section>

      <section className="site-container py-12">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              {INFO_ITEMS.map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-stone"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-blue-deep" />
                  </div>
                  <div>
                    <div className="text-xs text-ink-muted uppercase tracking-wider mb-0.5">
                      {label}
                    </div>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm text-ink hover:text-blue-deep transition-colors duration-200 font-medium"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-sm text-ink-secondary">{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Urgent CTA */}
            <div className="p-5 rounded-xl bg-blue-deep text-white">
              <p className="text-sm font-semibold mb-1">Urgent Matter?</p>
              <p className="text-xs text-white/70 leading-relaxed mb-4">
                {t("info.emergency")}. We handle time-sensitive legal situations
                around the clock.
              </p>
              <a
                href="tel:+998908250878"
                className="inline-flex items-center gap-2 text-sm font-semibold bg-white text-blue-deep px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-stone p-8">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-10"
                >
                  <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-sans text-2xl font-bold text-ink mb-3">
                    Message Sent
                  </h3>
                  <p className="text-ink-secondary mb-6">{t("form.success")}</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-3 rounded-lg text-sm font-semibold bg-blue-deep text-white hover:bg-blue-800 transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className="block text-xs text-ink-muted uppercase tracking-wider mb-2">
                        {t("form.name")} *
                      </label>
                      <input
                        {...register("name")}
                        placeholder={t("form.namePlaceholder")}
                        className={cn(
                          "w-full bg-cream border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-ink-muted",
                          "focus:outline-none focus:border-blue-deep focus:bg-white transition-all duration-200",
                          errors.name ? "border-red-400" : "border-stone"
                        )}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-xs text-ink-muted uppercase tracking-wider mb-2">
                        {t("form.company")}
                      </label>
                      <input
                        {...register("company")}
                        placeholder={t("form.companyPlaceholder")}
                        className="w-full bg-cream border border-stone rounded-lg px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-blue-deep focus:bg-white transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Email */}
                    <div>
                      <label className="block text-xs text-ink-muted uppercase tracking-wider mb-2">
                        {t("form.email")} *
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder={t("form.emailPlaceholder")}
                        className={cn(
                          "w-full bg-cream border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-ink-muted",
                          "focus:outline-none focus:border-blue-deep focus:bg-white transition-all duration-200",
                          errors.email ? "border-red-400" : "border-stone"
                        )}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs text-ink-muted uppercase tracking-wider mb-2">
                        {t("form.phone")}
                      </label>
                      <input
                        {...register("phone")}
                        placeholder={t("form.phonePlaceholder")}
                        className="w-full bg-cream border border-stone rounded-lg px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-blue-deep focus:bg-white transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Service */}
                  <div>
                    <label className="block text-xs text-ink-muted uppercase tracking-wider mb-2">
                      {t("form.service")}
                    </label>
                    <select
                      {...register("service")}
                      className="w-full bg-cream border border-stone rounded-lg px-4 py-3 text-sm text-ink focus:outline-none focus:border-blue-deep focus:bg-white transition-all duration-200"
                    >
                      <option value="">{t("form.servicePlaceholder")}</option>
                      {SERVICES.map((s) => (
                        <option key={s.slug} value={s.slug}>
                          {s.slug.charAt(0).toUpperCase() + s.slug.slice(1)} Law
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs text-ink-muted uppercase tracking-wider mb-2">
                      {t("form.message")} *
                    </label>
                    <textarea
                      {...register("message")}
                      rows={5}
                      placeholder={t("form.messagePlaceholder")}
                      className={cn(
                        "w-full bg-cream border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-ink-muted",
                        "focus:outline-none focus:border-blue-deep focus:bg-white transition-all duration-200 resize-none",
                        errors.message ? "border-red-400" : "border-stone"
                      )}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-lg text-base font-semibold bg-blue-deep text-white hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t("form.submitting")}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t("form.submit")}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
