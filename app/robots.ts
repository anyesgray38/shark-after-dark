import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://anyesgray38.github.io/shark-after-dark/sitemap.xml",
  };
}
