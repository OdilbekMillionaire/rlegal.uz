import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | R-Legal Practice",
    default: "R-Legal Practice | Premier Law Firm in Uzbekistan",
  },
  description:
    "Top-tier legal counsel for international investors, corporations, and entrepreneurs in Uzbekistan.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://rlegalpractice.uz"
  ),
  openGraph: {
    type: "website",
    siteName: "R-Legal Practice",
    locale: "en_US",
    alternateLocale: ["ru_RU", "uz_UZ"],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
