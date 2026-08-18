import { services } from "../lib/content/services";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-lead">
        <a className="brand" href="/" aria-label="Лаборатория тишины, главная">
          <span className="brand-mark" aria-hidden="true">LT</span>
          <span>Лаборатория<br />тишины</span>
        </a>
        <p>Инженерная шумоизоляция квартир.<br />Москва.</p>
      </div>
      <div className="footer-routes">
        <p className="tech-label">Решения</p>
        {services.slice(0, 5).map((item) => (
          <a key={item.slug} href={`/${item.slug}/`}>{item.navLabel}</a>
        ))}
      </div>
      <div className="footer-routes">
        <p className="tech-label">Информация</p>
        <a href="/diagnostika-shuma/">Диагностика</a>
        <a href="/cases/">Кейсы</a>
        <a href="/privacy/">Политика конфиденциальности</a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Лаборатория тишины</span>
        <span>15 лет работаем с шумом и вибрацией</span>
      </div>
    </footer>
  );
}

