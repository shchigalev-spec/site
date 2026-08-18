import { ArrowRight, Check, X } from "lucide-react";
import type { ServicePage as ServicePageData } from "../lib/content/services";
import { getCase } from "../lib/content/cases";
import { Header } from "./Header";

export function ServicePage({ service }: { service: ServicePageData }) {
  const caseStudy = getCase(service.caseSlug)!;
  return (
    <main className="service-page">
      <section className="service-hero">
        <Header />
        <div className="service-hero-copy">
          <nav className="breadcrumbs" aria-label="Хлебные крошки"><a href="/">Главная</a><span>/</span><span>{service.navLabel}</span></nav>
          <p className="eyebrow">{service.eyebrow}</p>
          <h1>{service.title}</h1>
          <p>{service.intro}</p>
          <button type="button" className="primary-cta" data-diagnostic data-location={`service_${service.slug}`} data-noise={service.noise} data-stage={service.stage} data-surface={service.surface}>{service.cta} <ArrowRight size={20} /></button>
        </div>
        <div className="service-room" aria-hidden="true">
          <div className="service-plane" /><div className="service-shadow" />
          <span>01 / SOURCE</span><span>02 / PATH</span><span>03 / BUILD</span>
          <i /><b /><em />
        </div>
      </section>

      <section className="decision-section section-pad">
        <div className="decision-title"><p className="eyebrow dark-label">Граница решения</p><h2>Что эта конструкция может решить — и где одной поверхности недостаточно.</h2></div>
        <div className="decision-yes"><span className="tech-label">Может решить</span>{service.solves.map((item) => <p key={item}><Check size={18} />{item}</p>)}</div>
        <div className="decision-no"><span className="tech-label">Сначала проверить</span>{service.limits.map((item) => <p key={item}><X size={18} />{item}</p>)}</div>
      </section>

      <section className="surface-map section-pad section-dark">
        <div className="surface-map-copy"><p className="eyebrow">Диагностическая карта</p><h2>Проверяем не материал, а путь и каждый критический узел.</h2><p>Состав решения появляется только после сравнения поверхности, периметра и обходных маршрутов.</p></div>
        <div className="surface-schematic" aria-hidden="true"><div className="schematic-core" />{service.map.map((_, index) => <span key={index} style={{ "--point": index } as React.CSSProperties}>{index + 1}</span>)}</div>
        <ol className="surface-points">{service.map.map((item, index) => <li key={item.point}><span>0{index + 1}</span><div><h3>{item.point}</h3><p>{item.detail}</p></div></li>)}</ol>
      </section>

      <section className="service-scenarios section-pad">
        <div className="section-heading"><p className="eyebrow dark-label">Не универсальный пирог</p><h2>Сценарий зависит от пути шума и ограничений квартиры.</h2></div>
        <div className="scenario-stream">{service.scenarios.map((item, index) => <article className={index === 1 ? "scenario-item offset" : "scenario-item"} key={item.label}><span className="tech-label">{item.label}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      </section>

      <section className="failure-section section-pad">
        <div className="failure-copy"><p className="eyebrow">Точки отказа</p><h2>Даже хорошая система теряет смысл, если узел собран жёстко.</h2><p>До монтажа фиксируем критические места, в процессе — фотографируем скрытые работы.</p></div>
        <ol>{service.failures.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ol>
      </section>

      <section className="service-case section-pad section-coral">
        <div className="service-case-visual" aria-hidden="true"><span /><i /><b /></div>
        <div className="service-case-copy"><p className="eyebrow dark-label">Связанный кейс / {caseStudy.room}</p><h2>{caseStudy.title}</h2><p>{caseStudy.found}</p><div className="case-measure"><strong>{caseStudy.before}</strong><ArrowRight /><strong>{caseStudy.after}</strong></div><a href={`/cases/${caseStudy.slug}/`}>Открыть контекст замера <ArrowRight size={18} /></a></div>
      </section>

      <section className="service-control section-pad">
        <div><p className="eyebrow dark-label">Ответственность одной команды</p><h2>Диагностика, проект, монтаж и проверка связаны общими контрольными точками.</h2></div>
        <ol><li><span>01</span>Фиксируем симптом и ограничения</li><li><span>02</span>Проектируем узлы и последовательность</li><li><span>03</span>Монтируем своей бригадой</li><li><span>04</span>Проверяем и документируем</li></ol>
      </section>

      <section className="service-faq section-pad">
        <div><p className="eyebrow dark-label">Вопросы по решению</p><h2>Что важно уточнить до сметы.</h2></div>
        <div className="faq-list">{service.faq.map((item, index) => <details key={item.question}><summary><span>0{index + 1}</span>{item.question}<i>+</i></summary><p>{item.answer}</p></details>)}</div>
      </section>

      <section className="service-final section-pad section-dark">
        <p className="eyebrow">Бесплатная диагностика</p><h2>{service.cta}.</h2><p>Опишите симптом и ограничения. Мы соберём предварительный профиль и согласуем следующий шаг.</p><button type="button" className="primary-cta" data-diagnostic data-location={`service_final_${service.slug}`} data-noise={service.noise} data-stage={service.stage} data-surface={service.surface}>Начать с симптома <ArrowRight size={20} /></button>
      </section>
    </main>
  );
}

