import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Header } from "../../components/Header";
import { cases } from "../../lib/content/cases";

export const metadata: Metadata = {
  title: "Кейсы шумоизоляции с замерами | Лаборатория тишины",
  description: "Измеряемые кейсы шумоизоляции квартир: что слышал житель, какой путь нашли, что построили и какой результат зафиксировали.",
  alternates: { canonical: "/cases/" },
};

export default function CasesPage() {
  return (
    <main className="listing-page">
      <section className="listing-hero section-dark">
        <Header />
        <div><p className="eyebrow">Контекст важнее красивого кадра</p><h1>Кейсы с проблемой, инженерным решением и замером.</h1><p>Показываем не обещание для любой квартиры, а зафиксированный результат конкретной комнаты. Исходные протоколы и фото для публикации проходят финальную проверку.</p></div>
      </section>
      <section className="case-list section-pad">
        {cases.map((item, index) => (
          <article key={item.slug} className="case-list-item">
            <div className="case-list-visual" aria-hidden="true"><span>0{index + 1}</span><i /><b /></div>
            <div className="case-list-copy"><p className="tech-label">{item.room}</p><h2>{item.title}</h2><dl><div><dt>Житель слышал</dt><dd>{item.heard}</dd></div><div><dt>Диагностика нашла</dt><dd>{item.found}</dd></div></dl><div className="case-measure"><strong>{item.before}</strong><ArrowRight /><strong>{item.after}</strong></div><a href={`/cases/${item.slug}/`}>Открыть весь контекст <ArrowRight size={18} /></a></div>
          </article>
        ))}
      </section>
      <section className="service-final section-pad section-dark"><p className="eyebrow">Ваша ситуация будет другой</p><h2>Сначала построим её карту передачи.</h2><button type="button" className="primary-cta" data-diagnostic data-location="cases_final">Начать диагностику <ArrowRight size={19} /></button></section>
    </main>
  );
}

