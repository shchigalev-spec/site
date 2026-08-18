"use client";

import { ArrowDown, ArrowRight, Check, MoveRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "../lib/analytics/metrica";
import { cases } from "../lib/content/cases";
import { homeFaq } from "../lib/content/faq";
import { getNoiseProfile, noiseProfiles, type NoiseProfile, type NoiseSlug } from "../lib/content/noiseProfiles";
import { Header } from "./Header";

const processSteps = [
  ["01", "Фиксируем симптом", "Что слышно, где, когда и как меняется звук."],
  ["02", "Проверяем пути передачи", "Поверхности, примыкания, шахты, трубы, окна и инженерные системы."],
  ["03", "Проектируем конструкцию", "Тип шума, основание, толщина, этап ремонта и критические узлы."],
  ["04", "Фиксируем состав и прогноз", "Объём, материалы, последовательность, ограничения и метод приёмки."],
  ["05", "Монтируем своей бригадой", "Защита помещения, контроль монтажа и фотофиксация скрытых работ."],
  ["06", "Проверяем результат", "Замер до и после, документированная передача результата."],
] as const;

const hotspots = [
  ["ceiling", "Потолок / плита", "Удар сверху возбуждает плиту, но часть энергии может уйти во фланговые стены.", "/shumoizolyatsiya-potolka/"],
  ["wall", "Смежная стена", "Речь проходит через полотно стены, розетки и негерметичный периметр.", "/shumoizolyatsiya-sten/"],
  ["floor", "Пол", "Плавающий узел снижает удар у источника, пока вибрация не вошла в конструкцию.", "/shumoizolyatsiya-pola/"],
  ["socket", "Розетка", "Сквозная коробка или ниша может стать локальным акустическим каналом.", "/shumoizolyatsiya-sten/"],
  ["window", "Окно / фасад", "Проверяем стеклопакет, откосы, монтажный шов и приточные устройства.", "/diagnostika-shuma/?noise=street"],
  ["vent", "Вентиляция", "Канал проводит речь, потоковый шум и иногда вибрацию оборудования.", "/diagnostika-shuma/?noise=ventilation"],
] as const;

export function HomeExperience() {
  const [profile, setProfile] = useState<NoiseProfile>(noiseProfiles[0]);
  const [hotspot, setHotspot] = useState(hotspots[0]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search);
      const saved = sessionStorage.getItem("lab-noise");
      setProfile(getNoiseProfile(params.get("noise") || saved));
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 760px)").matches) return;
    let contexts: { revert: () => void }[] = [];
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, scrollModule]) => {
      const gsap = gsapModule.default;
      const ScrollTrigger = scrollModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".process-step").forEach((item) => {
          gsap.from(item, { opacity: 0.3, x: 26, duration: 0.5, scrollTrigger: { trigger: item, start: "top 78%", end: "top 45%", scrub: true } });
        });
      });
      contexts = [context];
    }).catch(() => undefined);
    return () => contexts.forEach((context) => context.revert());
  }, []);

  const selectNoise = (slug: NoiseSlug) => {
    const selected = getNoiseProfile(slug);
    setProfile(selected);
    sessionStorage.setItem("lab-noise", slug);
    const url = new URL(window.location.href);
    url.searchParams.set("noise", slug);
    window.history.replaceState(window.history.state, "", url);
    trackEvent("noise_select", { noise_type: slug });
  };

  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <Header />
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Шумоизоляция квартир в Москве под ключ</p>
            <p className="proof-label">15 лет работаем с шумом и вибрацией</p>
            <h1 id="hero-title">Сначала найдём, как шум попадает в комнату. Потом рассчитаем решение.</h1>
            <p className="hero-lede">Диагностика, проект, собственная бригада, монтаж и проверка результата. Без покупки материалов вслепую и обещаний абсолютной тишины.</p>
            <button className="primary-cta" type="button" data-diagnostic data-location="hero" data-noise={profile.slug}>
              Записаться на бесплатную диагностику <ArrowRight size={20} aria-hidden="true" />
            </button>
            <p className="microcopy">Инженер уточнит ситуацию и согласует выезд.</p>
          </div>
          <div className="room-visual" aria-hidden="true">
            <div className="room-ceiling" />
            <div className="room-wall" />
            <div className="room-window" />
            <div className="room-bed"><i /><b /></div>
            <div className="room-floor" />
            <div className="scan-plane" />
            <WaveformCanvas profile={profile} />
            <div className="measure"><span>PATH / {profile.slug.toUpperCase()}</span><strong>↘</strong></div>
          </div>
        </div>
        <div className="proof-strip" aria-label="Принципы работы">
          <span>Замеры до / после</span><span>Собственная бригада</span><span>Без привязки к производителю</span><span>Договор и фотофиксация</span>
        </div>
        <a className="hero-scroll" href="#symptoms" aria-label="Перейти к выбору шума"><ArrowDown size={18} /></a>
      </section>

      <section className="symptom-section section-pad" id="symptoms" aria-labelledby="symptom-title">
        <div className="section-kicker"><span>01</span><p>Начните с того,<br />что слышите</p></div>
        <div className="section-heading">
          <p className="eyebrow dark-label">Предварительный профиль</p>
          <h2 id="symptom-title">Что именно вы слышите?</h2>
          <p>Выберите звук. Покажем вероятный тип шума, первые зоны проверки и следующий инженерный шаг.</p>
        </div>
        <div className="symptom-workbench">
          <div className="symptom-list" role="radiogroup" aria-label="Тип шума">
            {noiseProfiles.map((item, index) => (
              <button
                type="button"
                role="radio"
                aria-checked={profile.slug === item.slug}
                className={profile.slug === item.slug ? "symptom-row active" : "symptom-row"}
                key={item.slug}
                onClick={() => selectNoise(item.slug)}
              >
                <span className="symptom-number">0{index + 1}</span>
                <span className="symptom-name">{item.label}</span>
                <span className="symptom-share">{item.share}</span>
                <MoveRight size={21} aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className={`profile-panel profile-${profile.slug}`} aria-live="polite">
            <div className="profile-room" aria-hidden="true"><span /><i /><b /></div>
            <p className="tech-label">Вероятный профиль / {profile.slug}</p>
            <h3>{profile.category}</h3>
            <p>{profile.path}</p>
            <div className="profile-route"><span>Проверить</span>{profile.checks.map((check) => <b key={check}>{check}</b>)}</div>
            <button type="button" className="text-button" data-diagnostic data-location="symptom_result" data-noise={profile.slug}>Разобрать мою ситуацию <ArrowRight size={18} /></button>
          </div>
        </div>
      </section>

      <section className="path-section section-pad section-dark" aria-labelledby="path-title">
        <div className="section-kicker"><span>02</span><p>Карта передачи<br />вместо догадки</p></div>
        <div className="section-heading light-heading">
          <p className="eyebrow">Маршрут шума</p>
          <h2 id="path-title">Один шум может приходить в комнату несколькими путями.</h2>
          <p>Топот сверху не всегда решается только потолком. Голоса могут обходить стену через примыкания, розетки и перекрытия.</p>
        </div>
        <div className="path-lab">
          <div className="room-section" aria-hidden="true">
            <div className="section-ceiling" /><div className="section-wall" /><div className="section-floor" />
            {hotspots.map((item, index) => <span key={item[0]} className={`hotspot-dot hotspot-${item[0]} ${hotspot[0] === item[0] ? "active" : ""}`}>{index + 1}</span>)}
            <div className="energy-path" />
          </div>
          <div className="hotspot-panel">
            <p className="tech-label">Точки проверки</p>
            <div className="hotspot-tabs" role="list">
              {hotspots.map((item, index) => (
                <button type="button" key={item[0]} className={hotspot[0] === item[0] ? "active" : ""} onClick={() => { setHotspot(item); trackEvent("acoustic_hotspot_open", { hotspot: item[0] }); }}>
                  <span>0{index + 1}</span>{item[1]}
                </button>
              ))}
            </div>
            <div className="hotspot-result" aria-live="polite"><h3>{hotspot[1]}</h3><p>{hotspot[2]}</p><a href={hotspot[3]}>Подробнее о решении <ArrowRight size={17} /></a></div>
          </div>
        </div>
      </section>

      <section className="process-section section-pad" id="process" aria-labelledby="process-title">
        <div className="process-visual" aria-hidden="true">
          <div className="process-orbit"><i /><i /><i /></div>
          <div className="process-readout"><span>NOISE PATH</span><strong>→</strong><span>CONTROLLED BUILD</span></div>
        </div>
        <div className="process-content">
          <p className="eyebrow dark-label">От жалобы к проекту</p>
          <h2 id="process-title">Сначала диагностика. Потом смета.</h2>
          <div className="process-list">
            {processSteps.map(([number, title, text]) => <article className="process-step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="stages-section section-pad" id="solutions" aria-labelledby="stages-title">
        <div className="section-heading">
          <p className="eyebrow dark-label">Этап квартиры меняет решение</p>
          <h2 id="stages-title">Проектируем до ремонта и рассчитываем вмешательство после.</h2>
        </div>
        <div className="stage-flow">
          <article className="stage-main"><span className="tech-label">До отделки</span><h3>Согласовать весь контур, пока узлы открыты.</h3><p>Пол, стены, потолок, электрика и чистовые уровни соединяются в одной инженерной последовательности.</p><a href="/shumoizolyatsiya-v-novostroyke/">Шумоизоляция в новостройке <ArrowRight size={18} /></a></article>
          <article><span className="tech-label">Ремонт идёт</span><h3>Проверить до закрытия.</h3><p>Находим критические примыкания и координируем текущего подрядчика.</p><button type="button" className="text-button" data-diagnostic data-stage="repair" data-location="stage_repair">Проверить решение <ArrowRight size={18} /></button></article>
          <article><span className="tech-label">Квартира готова</span><h3>Сначала рассчитать вмешательство.</h3><p>Мебель, чистовая отделка, пыль, доступ и восстановление становятся частью проекта.</p><a href="/shumoizolyatsiya-v-gotovoy-kvartire/">Оценить сценарий <ArrowRight size={18} /></a></article>
        </div>
      </section>

      <section className="cases-section section-pad section-coral" aria-labelledby="cases-title">
        <div className="section-heading">
          <p className="eyebrow dark-label">Измеряемый контекст</p>
          <h2 id="cases-title">Не просто фотографии ремонта. Проблема, решение и замер.</h2>
        </div>
        <div className="case-run">
          {cases.map((item, index) => (
            <a className={`case-feature case-feature-${index + 1}`} href={`/cases/${item.slug}/`} key={item.slug} onClick={() => trackEvent("case_open", { case_slug: item.slug })}>
              <div className="case-abstract" aria-hidden="true"><span /><i /></div>
              <div className="case-copy"><span className="tech-label">Кейс 0{index + 1} / {item.room}</span><h3>{item.title}</h3><div className="case-measure"><strong>{item.before}</strong><ArrowRight /><strong>{item.after}</strong></div><p>{item.resultLabel}</p></div>
            </a>
          ))}
        </div>
        <a className="section-link" href="/cases/">Все кейсы и контекст измерений <ArrowRight size={19} /></a>
      </section>

      <ScenarioBuilder key={profile.slug} initialNoise={profile.slug} />

      <section className="control-section section-pad section-dark" aria-labelledby="control-title">
        <div className="section-heading light-heading"><p className="eyebrow">Монтажный контроль</p><h2 id="control-title">Результат зависит не только от материала, но и от каждого узла.</h2></div>
        <div className="inspection-board">
          <div className="inspection-large"><span className="tech-label">CONTROL / 01</span><h3>Развязка и герметичный периметр</h3><div className="joint-diagram" aria-hidden="true"><i /><b /><span /></div></div>
          <div><Check size={21} /><p>Подготовка основания и последовательность массы</p></div>
          <div><Check size={21} /><p>Розетки, трубы и проходки</p></div>
          <div className="inspection-wide"><Check size={21} /><p>Фотофиксация скрытых работ до закрытия</p></div>
          <div><Check size={21} /><p>Примыкания пола, стен и потолка</p></div>
          <div className="inspection-note"><p>Не привязаны к одному производителю. Подбираем систему под задачу, основание и ограничения квартиры.</p></div>
        </div>
      </section>

      <section className="contract-section section-pad" aria-labelledby="contract-title">
        <div className="contract-copy"><p className="eyebrow dark-label">Контроль вместо громких обещаний</p><h2 id="contract-title">До начала работ фиксируем, что строим и как принимаем результат.</h2><p>В договоре фиксируются состав работ, технология монтажа, критические узлы и порядок проверки результата. Формулировка гарантии зависит от утверждённых условий проекта.</p></div>
        <ol className="contract-points"><li><span>01</span>Технология и монтаж</li><li><span>02</span>Фотофиксация скрытых работ</li><li><span>03</span>Проверка результата</li><li><span>04</span>Ответственность одной команды</li></ol>
      </section>

      <section className="faq-section section-pad" id="faq" aria-labelledby="faq-title">
        <div className="faq-intro"><p className="eyebrow dark-label">Без маркетинговых обещаний</p><h2 id="faq-title">Честные ответы до выезда.</h2><p>Если ответ зависит от конструкции дома или состояния ремонта, так и говорим.</p></div>
        <div className="faq-list">{homeFaq.map((item, index) => <details key={item.question} onToggle={(event) => { if (event.currentTarget.open) trackEvent("faq_open", { question_id: index + 1 }); }}><summary><span>{String(index + 1).padStart(2, "0")}</span>{item.question}<i aria-hidden="true">+</i></summary><p>{item.answer}</p></details>)}</div>
      </section>

      <section className="final-section section-pad section-dark" aria-labelledby="final-title">
        <div className="final-copy"><p className="eyebrow">Следующий шаг</p><h2 id="final-title">Покажите, что вы слышите. Инженер подготовится до звонка.</h2><p>Опишите шум и приложите план, фото, видео или аудиозапись. Менеджер уточнит ситуацию и согласует бесплатную диагностику.</p><button type="button" className="primary-cta" data-diagnostic data-location="final" data-noise={profile.slug}>Записаться на диагностику <ArrowRight size={20} /></button><small>Без рассылок. Один контакт по вашей заявке.</small></div>
        <ol className="next-steps"><li><span>01</span><p>Уточним, что и когда слышно.</p></li><li><span>02</span><p>Посмотрим план и материалы, если вы их приложили.</p></li><li><span>03</span><p>Согласуем диагностику объекта в Москве.</p></li></ol>
      </section>
    </main>
  );
}

function WaveformCanvas({ profile }: { profile: NoiseProfile }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let frame = 0;
    let raf = 0;
    let visible = true;
    let pointer = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      context.clearRect(0, 0, width, height);
      ["rgba(255,101,66,.88)", "rgba(168,201,199,.72)", "rgba(250,249,244,.34)"].forEach((color, line) => {
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = line === 0 ? 2 : 1;
        for (let x = 0; x <= width; x += 5) {
          const index = Math.floor((x / width) * profile.wave.length) % profile.wave.length;
          const amplitude = profile.wave[index] * (1 - line * 0.18);
          const y = height * (0.36 + line * 0.19) + Math.sin(x * 0.035 + frame * (0.026 + line * 0.006) + pointer) * amplitude;
          if (x === 0) context.moveTo(x, y); else context.lineTo(x, y);
        }
        context.stroke();
      });
      if (!reduced && visible && !document.hidden) {
        frame += 1;
        raf = requestAnimationFrame(draw);
      }
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; cancelAnimationFrame(raf); draw(); });
    const onPointer = (event: PointerEvent) => { pointer = event.clientX * 0.003; };
    const onVisibility = () => { cancelAnimationFrame(raf); draw(); };
    resize();
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    draw();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [profile]);

  return <canvas ref={ref} className="hero-waveform" aria-hidden="true" />;
}

function ScenarioBuilder({ initialNoise }: { initialNoise: NoiseSlug }) {
  const [noise, setNoise] = useState<NoiseSlug>(initialNoise);
  const [direction, setDirection] = useState("above");
  const [stage, setStage] = useState("finished");
  const [space, setSpace] = useState("medium");
  const output = useMemo(() => {
    const profile = getNoiseProfile(noise);
    const level = noise === "ventilation" ? "вмешательство в инженерную систему" : noise === "bass" || direction === "unclear" ? "контур комнаты" : "одна поверхность + примыкания";
    const impact = stage === "new" ? "низкое" : stage === "repair" ? "среднее" : "требует оценки";
    return { profile, level, impact, zones: profile.checks.slice(0, space === "low" ? 3 : 4) };
  }, [noise, direction, stage, space]);

  return (
    <section className="scenario-section section-pad" aria-labelledby="scenario-title">
      <div className="scenario-form">
        <p className="eyebrow dark-label">Предварительный сценарий</p>
        <h2 id="scenario-title">Не цена за метр. Следующий разумный шаг.</h2>
        <label>Что слышно<select value={noise} onChange={(event) => setNoise(event.target.value as NoiseSlug)}>{noiseProfiles.map((item) => <option key={item.slug} value={item.slug}>{item.label}</option>)}</select></label>
        <label>Откуда<select value={direction} onChange={(event) => setDirection(event.target.value)}><option value="above">Сверху</option><option value="side">Сбоку</option><option value="below">Снизу</option><option value="street">С улицы</option><option value="unclear">Непонятно</option></select></label>
        <label>Этап квартиры<select value={stage} onChange={(event) => setStage(event.target.value)}><option value="new">До ремонта</option><option value="repair">Ремонт идёт</option><option value="finished">Готовая квартира</option></select></label>
        <label>Допустимая потеря пространства<select value={space} onChange={(event) => setSpace(event.target.value)}><option value="low">Минимальная</option><option value="medium">Сбалансированная</option><option value="high">Главное — эффективность</option></select></label>
      </div>
      <div className="scenario-output" aria-live="polite">
        <p className="tech-label">Вероятный сценарий / confidence: preliminary</p>
        <h3>{output.level}</h3>
        <p>{output.profile.category}. Влияние на ремонт: {output.impact}.</p>
        <div className="scenario-zones"><span>Зоны проверки</span>{output.zones.map((zone) => <b key={zone}>{zone}</b>)}</div>
        <p className="scenario-caveat">До точной оценки не хватает данных об основании, обходных путях, площади и узлах отделки.</p>
        <button type="button" className="primary-cta" data-diagnostic data-location="scenario" data-noise={noise} data-stage={stage}>Подтвердить на диагностике <ArrowRight size={19} /></button>
      </div>
    </section>
  );
}
