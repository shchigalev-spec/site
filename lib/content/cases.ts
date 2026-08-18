import type { ProofStatus } from "./site";

export type CaseStudy = {
  slug: string;
  title: string;
  room: string;
  before: string;
  after: string;
  resultLabel: string;
  heard: string;
  suspected: string;
  found: string;
  built: string;
  measured: string;
  limits: string;
  status: ProofStatus;
  prototypeAsset: boolean;
};

export const cases: CaseStudy[] = [
  {
    slug: "voices-monolith-bedroom",
    title: "Голоса через смежную стену в монолитной новостройке",
    room: "Спальня",
    before: "58 dB",
    after: "39 dB",
    resultLabel: "Замер после работ",
    heard: "Разборчивую речь и телевизор из соседней квартиры.",
    suspected: "Только смежную стену.",
    found: "Передачу через перегородку и ослабленные узлы по её периметру.",
    built: "Независимую облицовку с проработкой примыканий; состав требует сверки по исполнительной документации.",
    measured: "Уровень в контрольной точке снизился с 58 до 39 dB.",
    limits: "Методика и фон измерений должны быть подтверждены исходным протоколом.",
    status: "needs-verification",
    prototypeAsset: true,
  },
  {
    slug: "impact-panel-living-room",
    title: "Ударный шум сверху в панельном доме",
    room: "Гостиная",
    before: "71 dB peak",
    after: "−16 dB",
    resultLabel: "Снижение пикового уровня",
    heard: "Шаги, падение предметов и перемещение мебели сверху.",
    suspected: "Плиту потолка.",
    found: "Передачу по перекрытию с выраженными фланговыми путями через стены.",
    built: "Потолочный контур и критические примыкания; точный состав требует подтверждения.",
    measured: "Пиковый уровень исходно 71 dB, снижение после работ — 16 dB.",
    limits: "Ударные события и режим измерения требуют сверки по протоколу.",
    status: "needs-verification",
    prototypeAsset: true,
  },
  {
    slug: "street-home-office",
    title: "Уличный шум в домашнем кабинете",
    room: "Домашний кабинет",
    before: "64 dB",
    after: "43 dB",
    resultLabel: "Достигнутый уровень после работ",
    heard: "Постоянный дорожный фон и отдельные громкие проезды.",
    suspected: "Стеклопакет.",
    found: "Несколько фасадных путей: светопрозрачный узел, откосы и проход воздуха.",
    built: "Комплексное решение фасадного узла; спецификация требует подтверждения.",
    measured: "Уровень в контрольной точке снизился с 64 до достигнутых 43 dB.",
    limits: "Результат относится к конкретной комнате и условиям контрольного замера.",
    status: "needs-verification",
    prototypeAsset: true,
  },
];

export function getCase(slug: string) {
  return cases.find((item) => item.slug === slug);
}

