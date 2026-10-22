import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/dashboard/*", "/api", "/api/*"],
      },
    ],
    sitemap: "https://www.italive.ge/sitemap.xml",
    host: "https://www.italive.ge",
  };
}