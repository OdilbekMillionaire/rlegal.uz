import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { SectionLabel } from "@/components/atoms/SectionLabel";

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });
  return { title: `${t("terms")} | R-Legal Practice` };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });

  return (
    <main className="min-h-screen bg-cream pt-[108px]">
      <section className="bg-white border-b border-stone">
        <div className="site-container py-14">
          <SectionLabel className="mb-4">Legal</SectionLabel>
          <h1 className="font-sans font-bold text-ink mb-3" style={{ fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: "-0.025em" }}>
            {t("terms")}
          </h1>
          <div className="w-10 h-0.5 bg-blue-deep mb-4" />
          <p className="text-body-md text-ink-muted">Last updated: April 2026</p>
        </div>
      </section>

      <div className="site-container py-12 max-w-3xl">
        <div className="space-y-5">
          {[
            {
              title: "1. Acceptance of Terms",
              body: "By accessing or using the R-Legal Practice website (the 'Site'), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Site. R-Legal Practice reserves the right to modify these terms at any time.",
            },
            {
              title: "2. No Attorney-Client Relationship",
              body: "The information provided on this Site is for general informational purposes only and does not constitute legal advice. Use of this Site does not create an attorney-client relationship between you and R-Legal Practice. For legal advice specific to your situation, please consult one of our attorneys directly.",
            },
            {
              title: "3. AI Legal Advisor Disclaimer",
              body: "The AI Legal Advisor feature on this Site provides automated responses based on general information about Uzbekistan law. These responses are informational only, may not reflect the most current legal developments, and do not constitute legal advice. AI responses should not be relied upon for legal decisions. Always consult a qualified attorney for binding legal guidance.",
            },
            {
              title: "4. Intellectual Property",
              body: "All content on this Site, including text, graphics, logos, images, and software, is the property of R-Legal Practice or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.",
            },
            {
              title: "5. Confidentiality of Communications",
              body: "Unsolicited emails and submissions through our contact form do not create an attorney-client relationship and are not protected by attorney-client privilege until a formal engagement agreement is signed. Please do not submit confidential or privileged information through this Site until you have established a formal client relationship with R-Legal Practice.",
            },
            {
              title: "6. Limitation of Liability",
              body: "R-Legal Practice makes no warranties regarding the accuracy, completeness, or suitability of information on this Site. To the maximum extent permitted by law, R-Legal Practice shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of this Site or reliance on its content.",
            },
            {
              title: "7. Third-Party Links",
              body: "This Site may contain links to third-party websites for your convenience. R-Legal Practice does not endorse or control these sites and is not responsible for their content, privacy practices, or reliability. Your use of third-party sites is at your own risk.",
            },
            {
              title: "8. Governing Law",
              body: "These Terms of Use shall be governed by and construed in accordance with the laws of the Republic of Uzbekistan. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Tashkent, Uzbekistan, or as otherwise agreed in a written engagement agreement.",
            },
            {
              title: "9. Contact",
              body: "If you have questions about these Terms of Use, please contact us at: rlegalpractice@gmail.com or +998 90 825 08 78.",
            },
          ].map((section) => (
            <div key={section.title} className="bg-white border border-stone rounded-sm p-6">
              <h2 className="text-heading-sm font-bold text-ink mb-3">{section.title}</h2>
              <p className="text-body-md text-ink-secondary leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
