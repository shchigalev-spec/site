import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Header } from "../../components/Header";

export const metadata: Metadata = {
  title: "Заявка отправлена | Лаборатория тишины",
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const { sent } = await searchParams;
  const confirmed = sent === "1";
  return (
    <main className="thank-page section-dark">
      <Header />
      <div className="thank-copy">
        {confirmed && <CheckCircle2 size={42} aria-hidden="true" />}
        <p className="eyebrow">{confirmed ? "Заявка подтверждена сервером" : "Страница подтверждения"}</p>
        <h1>{confirmed ? "Заявка принята. Следующий шаг — короткое уточнение ситуации." : "Здесь появится подтверждение после успешной отправки."}</h1>
        <p>{confirmed ? "Менеджер свяжется с вами, уточнит, что и когда слышно, посмотрит приложенные материалы и согласует диагностику объекта в Москве." : "Вернитесь к диагностике и отправьте предварительный профиль."}</p>
        <a className="primary-cta" href={confirmed ? "/" : "/diagnostika-shuma/"}>{confirmed ? "Вернуться на главную" : "Начать диагностику"}</a>
      </div>
    </main>
  );
}

