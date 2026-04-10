/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://rlegalpractice.uz",
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  alternateRefs: [
    { href: "https://rlegalpractice.uz/en", hreflang: "en" },
    { href: "https://rlegalpractice.uz/ru", hreflang: "ru" },
    { href: "https://rlegalpractice.uz/uz", hreflang: "uz" },
    { href: "https://rlegalpractice.uz/uz-cyrl", hreflang: "uz-Cyrl" },
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/api/"] },
    ],
    additionalSitemaps: [
      "https://rlegalpractice.uz/sitemap.xml",
    ],
  },
  exclude: ["/api/*"],
  changefreq: "weekly",
  priority: 0.7,
  transform: async (config, path) => {
    const priority =
      path === "/" ? 1.0
      : path.includes("/services") || path.includes("/ai-advisor") ? 0.9
      : path.includes("/case-studies") || path.includes("/contact") ? 0.8
      : 0.7;

    return {
      loc: path,
      changefreq: config.changefreq,
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
