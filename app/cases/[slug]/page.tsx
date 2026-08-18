import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Header } from "../../../components/Header";
import { cases, getCase } from "../../../lib/content/cases";

export const dynamicParams = false;

export function generateStaticParams() {
  return cases.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) return {};
  const description = `${item.heard} ${item.measured} Контекст решения и ограничения результата.`;
  return {
    title: `${item.title} | Кейс Лаборатории тишины`,
    description,
    alternates: { canonical: `/cases/${item.slug}/` },
    openGraph: { title: item.title, description, images: [] },
    twitter: { card: "summary", title: item.title, description, images: [] },
  };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) notFound();
  return (
    <main className="case-page">
      <section className="case-detail-hero section-dark">
        <Header />
        <div className="case-detail-copy"><a className="back-link" href="/cases/"><ArrowLeft size={17} /> Все кейсы</a><p className="eyebrow">Кейс / {item.room}</p><h1>{item.title}</h1><div className="case-measure"><strong>{item.before}</strong><ArrowRight /><strong>{item.after}</strong></div><p>{item.resultLabel}</p></div>
        <div className="case-detail-visual" aria-hidden="true"><span /><i /><b /><em /></div>
      </section>
      <section className="case-narrative section-pad">
        <article><span>01</span><p className="tech-label">Что слышал житель</p><h2>{item.heard}</h2></article>
        <article><span>02</span><p className="tech-label">Где подозревали путь</p><h2>{item.suspected}</h2></article>
        <article><span>03</span><p className="tech-label">Что показала диагностика</p><h2>{item.found}</h2></article>
        <article><span>04</span><p className="tech-label">Что построили</p><h2>{item.built}</h2></article>
        <article><span>05</span><p className="tech-label">Что измерили после</p><h2>{item.measured}</h2></article>
        <article className="case-limit"><span>!</span><p className="tech-label">Граница результата</p><h2>{item.limits}</h2></article>
      </section>
      <section className="service-final section-pad section-coral"><p className="eyebrow dark-label">Не переносим цифры с одного объекта на другой</p><h2>Проверим вашу квартиру отдельно.</h2><button type="button" className="primary-cta dark-cta" data-diagnostic data-location={`case_${item.slug}`}>Записаться на диагностику <ArrowRight size={19} /></button></section>
    </main>
  );
}

