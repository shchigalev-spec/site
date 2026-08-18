import type { MetadataRoute } from "next";
import { site } from "../lib/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/design-lab/", "/thank-you/"] },
    sitemap: new URL("/sitemap.xml", site.canonicalUrl).toString(),
  };
}

