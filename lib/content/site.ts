export type ProofStatus =
  | "confirmed"
  | "prototype"
  | "needs-verification"
  | "blocked";

export const site = {
  brand: "Лаборатория тишины",
  city: "Москва",
  experience: "15 лет работаем с шумом и вибрацией",
  diagnosisOffer: "Бесплатная диагностика",
  diagnosisOfferStatus: "needs-verification" as ProofStatus,
  phone: null,
  email: null,
  canonicalUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  doorServiceEnabled: false,
  maxFiles: 6,
  maxUploadBytes: 25 * 1024 * 1024,
} as const;

export const navigation = [
  { label: "Решения", href: "/#solutions" },
  { label: "Диагностика", href: "/diagnostika-shuma/" },
  { label: "Как работаем", href: "/#process" },
  { label: "Кейсы", href: "/cases/" },
  { label: "Вопросы", href: "/#faq" },
] as const;

