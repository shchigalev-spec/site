export type NoiseSlug =
  | "steps"
  | "voices"
  | "bass"
  | "lift"
  | "street"
  | "ventilation"
  | "other";

export type NoiseProfile = {
  slug: NoiseSlug;
  label: string;
  share?: string;
  category: string;
  direction: string;
  checks: string[];
  path: string;
  wave: number[];
};

export const noiseProfiles: NoiseProfile[] = [
  {
    slug: "steps",
    label: "Топот сверху",
    share: "≈40%",
    category: "Ударный и структурный шум",
    direction: "Перекрытие, стены и жёсткие примыкания",
    checks: ["плита перекрытия", "подвесы потолка", "фланговые стены", "проходки"],
    path: "Удар может войти через плиту и продолжить путь по стенам — один потолок не всегда закрывает контур.",
    wave: [9, 34, 12, 48, 18, 42, 8, 29],
  },
  {
    slug: "voices",
    label: "Голоса за стеной",
    share: "≈25%",
    category: "Воздушный шум",
    direction: "Перегородка, розетки и периметр",
    checks: ["состав стены", "розетки", "примыкания", "пол и потолок"],
    path: "Речь проходит через слабые места перегородки и может обходить её по смежным конструкциям.",
    wave: [15, 25, 20, 32, 18, 28, 17, 23],
  },
  {
    slug: "bass",
    label: "Басы и музыка",
    share: "≈15%",
    category: "Низкочастотный воздушный + структурный шум",
    direction: "Полный контур комнаты",
    checks: ["стены", "перекрытия", "низкочастотные мосты", "примыкания"],
    path: "Длинная низкочастотная волна огибает локальные решения, поэтому проверяется весь контур.",
    wave: [12, 40, 22, 45, 18, 43, 20, 38],
  },
  {
    slug: "lift",
    label: "Лифт",
    share: "≈7%",
    category: "Структурная вибрация",
    direction: "Шахта и жёсткие связи здания",
    checks: ["стена шахты", "плиты", "узлы крепления", "смежные помещения"],
    path: "Вибрация от оборудования передаётся по бетону и может проявляться вдали от шахты.",
    wave: [7, 43, 6, 44, 8, 40, 5, 38],
  },
  {
    slug: "street",
    label: "Дорога и улица",
    share: "≈7%",
    category: "Воздушный и фасадный шум",
    direction: "Окно, откосы, фасад и вентиляция",
    checks: ["стеклопакет", "монтажный шов", "откосы", "приточные устройства"],
    path: "Даже хорошее окно не решит задачу, если звук входит через монтажный шов или вентиляцию.",
    wave: [17, 29, 16, 34, 12, 30, 18, 26],
  },
  {
    slug: "ventilation",
    label: "Вентиляция",
    share: "≈6%",
    category: "Шум инженерных систем",
    direction: "Канал, короб, проходки и оборудование",
    checks: ["воздуховод", "короб", "проходки", "виброразвязка оборудования"],
    path: "Канал может одновременно проводить речь, потоковый шум и вибрацию оборудования.",
    wave: [11, 23, 10, 31, 9, 27, 8, 24],
  },
];

export const noiseLabels = Object.fromEntries(
  [...noiseProfiles, { slug: "other", label: "Другой шум" }].map((item) => [
    item.slug,
    item.label,
  ]),
) as Record<NoiseSlug, string>;

export function getNoiseProfile(value?: string | null) {
  return noiseProfiles.find((profile) => profile.slug === value) || noiseProfiles[0];
}

