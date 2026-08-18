"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navigation } from "../lib/content/site";

export function Header({ dark = true }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header className={`site-header ${dark ? "site-header-dark" : "site-header-light"}`}>
      <a className="brand" href="/" aria-label="Лаборатория тишины, главная">
        <span className="brand-mark" aria-hidden="true">LT</span>
        <span>Лаборатория<br />тишины</span>
      </a>
      <nav className="desktop-nav" aria-label="Основная навигация">
        {navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
      </nav>
      <button
        className="header-cta"
        type="button"
        data-diagnostic
        data-location="header"
      >
        Записаться на диагностику
      </button>
      <button
        className="menu-button"
        type="button"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      {open && (
        <div className="mobile-menu">
          <nav aria-label="Мобильная навигация">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}<span aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
          <button type="button" className="primary-cta" data-diagnostic data-location="mobile_menu">
            Записаться на диагностику
          </button>
        </div>
      )}
    </header>
  );
}

