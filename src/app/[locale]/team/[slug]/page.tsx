import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TEAM_MEMBERS } from "@/lib/constants";
import { Linkedin, Phone, Mail, ArrowRight, BookOpen, Globe } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Breadcrumb } from "@/components/molecules/Breadcrumb";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

// Use member id as slug
export async function generateStaticParams() {
  return TEAM_MEMBERS.map((m) => ({ slug: m.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = TEAM_MEMBERS.find((m) => m.id === slug);
  if (!member) return {};
  return {
    title: `${member.name} | R-Legal Practice`,
    description: member.bio,
  };
}

export default async function TeamMemberPage({ params }: Props) {
  const { locale, slug } = await params;
  const member = TEAM_MEMBERS.find((m) => m.id === slug);
  if (!member) notFound();

  const t = await getTranslations({ locale, namespace: "team" });
  const tBreadcrumb = await getTranslations({ locale, namespace: "breadcrumb" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const roleLocal =
    locale === "ru" ? member.roleRu :
    locale === "uz" || locale === "uz-cyrl" ? member.roleUz :
    member.role;

  return (
    <main className="min-h-screen bg-cream pt-[108px]">
      {/* Hero */}
      <section className="bg-white border-b border-stone">
        <div className="site-container py-14">
          <Breadcrumb
            locale={locale}
            homeLabel={tBreadcrumb("home")}
            items={[
              { label: tNav("team"), href: `/${locale}/team` },
              { label: member.name },
            ]}
          />
          <div className="mt-8 flex flex-col sm:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-sm bg-blue-deep flex items-center justify-center text-white font-bold flex-shrink-0"
              style={{ fontSize: 40 }}>
              {member.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-sans font-bold text-ink mb-1 leading-tight" style={{ fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.025em" }}>
                {member.name}
              </h1>
              <p className="text-body-lg text-blue-action font-semibold mb-2">{roleLocal}</p>
              <p className="text-body-md text-ink-secondary">{member.yearsExp} {t("yearsExp")}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {member.languages.map((lang) => (
                  <span key={lang} className="px-2.5 py-1 text-caption font-bold bg-blue-pale text-blue-deep rounded-sm border border-blue-light/50 uppercase">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="site-container py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main */}
          <div className="lg:col-span-2 space-y-10">
            {/* Bio */}
            <div>
              <h2 className="text-heading-lg font-bold text-ink mb-5">About</h2>
              <p className="text-body-lg text-ink-secondary leading-relaxed">{member.bio}</p>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-heading-lg font-bold text-ink mb-5 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-action" /> Education
              </h2>
              <div className="space-y-3">
                {member.education.map((edu) => (
                  <div key={edu} className="flex items-start gap-3 p-4 bg-white border border-stone rounded-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-deep mt-2 flex-shrink-0" />
                    <p className="text-body-md text-ink-secondary">{edu}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Admitted In */}
            <div>
              <h2 className="text-heading-lg font-bold text-ink mb-5 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-action" /> {t("admittedIn")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {member.admittedIn.map((bar) => (
                  <span key={bar} className="px-4 py-2 bg-white border border-stone rounded-sm text-body-sm font-medium text-ink-secondary">
                    {bar}
                  </span>
                ))}
              </div>
            </div>

            {/* Specializations */}
            <div>
              <h2 className="text-heading-lg font-bold text-ink mb-5">Practice Areas</h2>
              <div className="flex flex-wrap gap-2">
                {member.specializations.map((spec) => (
                  <span key={spec} className="px-4 py-2 bg-blue-pale text-blue-deep text-body-sm font-semibold rounded-sm border border-blue-light/50 capitalize">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-blue-deep p-7 rounded-sm text-white sticky top-[130px]">
              <h3 className="text-heading-sm font-bold mb-3">Work with {member.name.split(" ")[0]}</h3>
              <p className="text-body-sm text-white/70 mb-5">Schedule a confidential consultation directly.</p>
              <Link href="/contact" className="flex items-center justify-center gap-2 w-full py-3 bg-white text-blue-deep font-semibold text-body-sm rounded-sm hover:bg-blue-pale transition-colors mb-3">
                Book Consultation <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="tel:+998908250878" className="flex items-center justify-center gap-2 w-full py-3 border border-white/30 text-white text-body-sm font-medium rounded-sm hover:bg-white/10 transition-colors mb-2">
                <Phone className="w-4 h-4" /> +998 90 825 08 78
              </a>
              <a href="mailto:rlegalpractice@gmail.com" className="flex items-center justify-center gap-2 w-full py-3 border border-white/30 text-white text-body-sm font-medium rounded-sm hover:bg-white/10 transition-colors mb-4">
                <Mail className="w-4 h-4" /> Email
              </a>
              {member.linkedin && (
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 border border-white/20 text-white/60 text-body-sm rounded-sm hover:text-white transition-colors">
                  <Linkedin className="w-4 h-4" /> LinkedIn Profile
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
