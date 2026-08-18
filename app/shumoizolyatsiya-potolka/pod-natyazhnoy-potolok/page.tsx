import type { Metadata } from "next";
import { ServicePage } from "../../../components/ServicePage";
import { getService } from "../../../lib/content/services";

const service = getService("shumoizolyatsiya-potolka/pod-natyazhnoy-potolok")!;

export const metadata: Metadata = {
  title: `${service.eyebrow} | Лаборатория тишины`,
  description: service.description,
  alternates: { canonical: `/${service.slug}/` },
  openGraph: { title: service.eyebrow, description: service.description },
  twitter: { card: "summary", title: service.eyebrow, description: service.description },
};

export default function Page() {
  return <ServicePage service={service} />;
}

