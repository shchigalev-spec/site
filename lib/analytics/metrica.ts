export type MetricaEvent =
  | "page_view"
  | "cta_diagnostic_click"
  | "noise_select"
  | "acoustic_hotspot_open"
  | "diagnostic_start"
  | "diagnostic_step_complete"
  | "diagnostic_complete"
  | "file_upload_add"
  | "form_start"
  | "form_submit_success"
  | "form_submit_error"
  | "phone_click"
  | "email_click"
  | "case_open"
  | "faq_open"
  | "scroll_50"
  | "scroll_90";

declare global {
  interface Window {
    ym?: (id: number, method: string, goal: string, params?: Record<string, unknown>) => void;
    __labMetricaId?: number;
  }
}

export function trackEvent(
  event: MetricaEvent,
  properties: Record<string, string | number | boolean | undefined> = {},
) {
  if (typeof window === "undefined" || !window.ym || !window.__labMetricaId) return;
  const safeProperties = Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined),
  );
  window.ym(window.__labMetricaId, "reachGoal", event, safeProperties);
}

export function readCampaignContext() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem("lab-campaign") || "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

