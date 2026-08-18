import type { Metadata } from "next";
import { Geologica, IBM_Plex_Mono, Onest } from "next/font/google";
import { Analytics } from "../components/Analytics";
import { DiagnosticShell } from "../components/DiagnosticShell";
import { Footer } from "../components/Footer";
import { services } from "../lib/content/services";
import { site } from "../lib/content/site";
import "./globals.css";

const displayFont = Geologica({ variable: "--font-display", subsets: ["cyrillic", "latin"] });
const bodyFont = Onest({ variable: "--font-body", subsets: ["cyrillic", "latin"] });
const monoFont = IBM_Plex_Mono({ variable: "--font-mono", subsets: ["cyrillic", "latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.canonicalUrl),
  title: "Шумоизоляция квартир в Москве под ключ | Лаборатория тишины",
  description:
    "Инженерная шумоизоляция квартир в Москве: диагностика источника и путей шума, проект, собственная бригада, монтаж и проверка результата.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    title: "Сначала найдём путь шума | Лаборатория тишины",
    description: "Инженерная шумоизоляция квартир в Москве: диагностика, проект, монтаж и проверка результата.",
    images: [{ url: "/og.png", width: 1680, height: 945, alt: "Инженер сканирует акустический путь в современной квартире" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Сначала найдём путь шума | Лаборатория тишины",
    description: "Инженерная шумоизоляция квартир в Москве: диагностика, проект, монтаж и проверка результата.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
        <Analytics />
        <DiagnosticShell>
          {children}
          <Footer />
        </DiagnosticShell>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: site.brand,
              areaServed: { "@type": "City", name: site.city },
              description: "Инженерная шумоизоляция квартир: диагностика, проект, монтаж и проверка результата.",
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Инженерные решения по шумоизоляции",
                itemListElement: services.map((service) => ({
                  "@type": "Service",
                  name: service.eyebrow,
                  areaServed: { "@type": "City", name: site.city },
                  url: new URL(`/${service.slug}/`, site.canonicalUrl).toString(),
                })),
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
