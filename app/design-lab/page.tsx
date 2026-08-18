import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Header } from "../../components/Header";

export const metadata: Metadata = {
  title: "Design Lab | Лаборатория тишины",
  robots: { index: false, follow: false },
};

export default function DesignLabPage() {
  return (
    <main className="design-lab">
      <section className="design-lab-intro"><Header dark={false} /><p className="eyebrow dark-label">Internal / noindex</p><h1>Два языка одной инженерной идеи.</h1></section>
      <section className="concept concept-a"><div><span className="tech-label">A / production</span><h2>Сначала найдём путь шума.</h2><p>Тёплая жилая сцена пересекается плоскостью акустического сканирования.</p><button type="button" className="primary-cta" data-diagnostic data-location="design_a">Выбрать симптом <ArrowRight size={18} /></button></div><div className="concept-room" aria-hidden="true"><i /><b /><span /></div></section>
      <section className="concept concept-b"><div className="blueprint-room" aria-hidden="true"><i /><b /><span /><em /></div><div><span className="tech-label">B / challenger</span><h2>Acoustic Blueprint.</h2><p>Комната как разрез: точки измерения, узлы, обходные маршруты и слой инженерного решения.</p><button type="button" className="outline-button" data-diagnostic data-location="design_b">Открыть карту <ArrowRight size={18} /></button></div></section>
    </main>
  );
}

