"use client";

import { useEffect } from "react";
import { trackEvent } from "../lib/analytics/metrica";

const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

export function Analytics() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const campaign = Object.fromEntries(
      utmKeys.flatMap((key) => (params.get(key) ? [[key, params.get(key)!]] : [])),
    );
    if (Object.keys(campaign).length) {
      sessionStorage.setItem("lab-campaign", JSON.stringify(campaign));
    }

    const rawId = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID;
    const id = rawId ? Number(rawId) : 0;
    if (id > 0) {
      window.__labMetricaId = id;
      const ym = function (...args: unknown[]) {
        // @ts-expect-error Yandex Metrica queue signature
        (ym.a = ym.a || []).push(args);
      } as unknown as typeof window.ym;
      window.ym = window.ym || ym;
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://mc.yandex.ru/metrika/tag.js";
      document.head.appendChild(script);
      window.ym?.(id, "init", "init", {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
      });
    }

    trackEvent("page_view", { path: window.location.pathname });

    const sent = new Set<number>();
    const onScroll = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      if (available <= 0) return;
      const ratio = window.scrollY / available;
      if (ratio >= 0.5 && !sent.has(50)) {
        sent.add(50);
        trackEvent("scroll_50", { path: window.location.pathname });
      }
      if (ratio >= 0.9 && !sent.has(90)) {
        sent.add(90);
        trackEvent("scroll_90", { path: window.location.pathname });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}

