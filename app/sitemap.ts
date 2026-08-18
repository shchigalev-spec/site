import type { MetadataRoute } from "next";
import { cases } from "../lib/content/cases";
import { services } from "../lib/content/services";
import { site } from "../lib/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", ...services.map((item) => item.slug), "cases", ...cases.map((item) => `cases/${item.slug}`), "privacy"];
  return routes.map((route) => ({ url: new URL(`/${route}${route ? "/" : ""}`, site.canonicalUrl).toString(), changeFrequency: route.startsWith("cases/") ? "monthly" : "weekly", priority: route === "" ? 1 : 0.7 }));
}

