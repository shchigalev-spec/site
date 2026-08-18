import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage } from "../../components/ServicePage";
import { getService, services } from "../../lib/content/services";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.filter((item) => !item.slug.includes("/")).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: `${service.eyebrow} | Лаборатория тишины`,
    description: service.description,
    alternates: { canonical: `/${service.slug}/` },
    openGraph: { title: service.eyebrow, description: service.description, type: "website" },
    twitter: { card: "summary", title: service.eyebrow, description: service.description },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  return <ServicePage service={service} />;
}

