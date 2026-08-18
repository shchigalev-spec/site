"use client";

import { ArrowLeft, ArrowRight, FileText, Paperclip, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { readCampaignContext, trackEvent } from "../lib/analytics/metrica";
import { noiseLabels, noiseProfiles, type NoiseSlug } from "../lib/content/noiseProfiles";

type DiagnosticState = {
  symptom: NoiseSlug;
  direction: string;
  pattern: string;
  rooms: string;
  stage: string;
  building: string;
  area: string;
  surface: string;
  name: string;
  phone: string;
  email: string;
  preferredContact: "phone" | "email";
  consent: boolean;
};

const initialState: DiagnosticState = {
  symptom: "steps",
  direction: "unclear",
  pattern: "episodic",
  rooms: "one",
  stage: "",
  building: "",
  area: "",
  surface: "",
  name: "",
  phone: "",
  email: "",
  preferredContact: "phone",
  consent: false,
};

const allowedExtensions = ["pdf", "jpg", "jpeg", "png", "heic", "mp4", "mov", "m4a", "mp3", "wav"];
const maxFiles = 6;
const maxBytes = 25 * 1024 * 1024;

function loadSavedState(): DiagnosticState {
  if (typeof window === "undefined") return initialState;
  try {
    const saved = JSON.parse(sessionStorage.getItem("lab-diagnostic") || "{}") as Partial<DiagnosticState>;
    const params = new URLSearchParams(window.location.search);
    return {
      ...initialState,
      ...saved,
      symptom: (params.get("noise") as NoiseSlug) || saved.symptom || initialState.symptom,
      stage: params.get("stage") || saved.stage || "",
      surface: params.get("surface") || saved.surface || "",
    };
  } catch {
    return initialState;
  }
}

export function DiagnosticShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [state, setState] = useState<DiagnosticState>(initialState);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [source, setSource] = useState("unknown");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setState(loadSavedState()));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("lab-diagnostic", JSON.stringify(state));
  }, [state]);

  const launch = useCallback((trigger?: HTMLElement) => {
    const next = loadSavedState();
    const symptom = trigger?.dataset.noise as NoiseSlug | undefined;
    setState({
      ...next,
      symptom: symptom || next.symptom,
      stage: trigger?.dataset.stage || next.stage,
      surface: trigger?.dataset.surface || next.surface,
    });
    const location = trigger?.dataset.location || "page";
    setSource(location);
    setStep(1);
    setError("");
    setOpen(true);
    window.history.pushState({ diagnostic: true, step: 1 }, "", window.location.href);
    trackEvent("cta_diagnostic_click", {
      location,
      text: trigger?.textContent?.trim().slice(0, 80) || "diagnostic",
    });
    trackEvent("diagnostic_start", { source: location });
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
    if (window.history.state?.diagnostic) window.history.back();
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const trigger = target.closest<HTMLElement>("[data-diagnostic]");
      if (!trigger) return;
      event.preventDefault();
      launch(trigger);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [launch]);

  useEffect(() => {
    const onPopState = () => {
      if (!open) return;
      if (step > 1) setStep((value) => Math.max(1, value - 1));
      else setOpen(false);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [open, step]);

  useEffect(() => {
    if (!open) return;
    const prior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => dialogRef.current?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDialog();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prior;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeDialog]);

  const setField = <K extends keyof DiagnosticState>(key: K, value: DiagnosticState[K]) => {
    setState((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const next = () => {
    if (step === 1 && !state.symptom) return setError("Выберите, что вы слышите.");
    if (step === 2 && (!state.direction || !state.pattern || !state.rooms)) return setError("Ответьте на вопросы этого шага.");
    if (step === 3 && !state.stage) return setError("Укажите этап ремонта.");
    trackEvent("diagnostic_step_complete", { step });
    const nextStep = Math.min(5, step + 1);
    setStep(nextStep);
    setError("");
    window.history.pushState({ diagnostic: true, step: nextStep }, "", window.location.href);
  };

  const back = () => {
    if (step === 1) return closeDialog();
    window.history.back();
  };

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const nextFiles = [...files, ...Array.from(incoming)];
    if (nextFiles.length > maxFiles) return setError(`Можно приложить не более ${maxFiles} файлов.`);
    const unsupported = nextFiles.find((file) => !allowedExtensions.includes(file.name.split(".").pop()?.toLowerCase() || ""));
    if (unsupported) return setError("Поддерживаются PDF, JPG, PNG, HEIC, MP4, MOV, M4A, MP3 и WAV.");
    if (nextFiles.reduce((sum, file) => sum + file.size, 0) > maxBytes) return setError("Общий размер файлов не должен превышать 25 МБ.");
    setFiles(nextFiles);
    setError("");
    Array.from(incoming).forEach((file) => trackEvent("file_upload_add", { file_type: file.type.split("/")[0] || "file" }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!state.name.trim()) return setError("Укажите имя.");
    if (state.phone.replace(/\D/g, "").length < 10) return setError("Проверьте номер телефона.");
    if (state.preferredContact === "email" && !state.email.includes("@")) return setError("Укажите email для связи.");
    if (!state.consent) return setError("Нужно согласие на обработку данных.");

    setSubmitting(true);
    setError("");
    const payload = {
      ...state,
      scenario: getScenario(state.symptom, state.direction),
      route: window.location.pathname,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      source,
      ...readCampaignContext(),
    };
    const body = new FormData();
    body.append("payload", JSON.stringify(payload));
    files.forEach((file) => body.append("files", file));

    try {
      const response = await fetch("/api/lead", { method: "POST", body });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "Не удалось отправить заявку.");
      trackEvent("diagnostic_complete", { noise_type: state.symptom, stage: state.stage });
      trackEvent("form_submit_success", { location: source });
      sessionStorage.removeItem("lab-diagnostic");
      window.location.assign("/thank-you/?sent=1");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось отправить заявку. Попробуйте ещё раз.");
      trackEvent("form_submit_error", { location: source, kind: "delivery" });
      setSubmitting(false);
    }
  };

  const totalBytes = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files]);

  return (
    <>
      {children}
      <button className="mobile-sticky-cta" type="button" data-diagnostic data-location="mobile_sticky">
        Бесплатная диагностика <ArrowRight size={18} aria-hidden="true" />
      </button>
      {open && (
        <div className="diagnostic-overlay" role="presentation">
          <div
            className="diagnostic-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="diagnostic-title"
            tabIndex={-1}
            ref={dialogRef}
          >
            <div className="diagnostic-rail" aria-hidden="true">
              <span>DIAGNOSTIC / {String(step).padStart(2, "0")}</span>
              <div className="diagnostic-meter"><i style={{ height: `${step * 20}%` }} /></div>
              <span>ПРЕДВАРИТЕЛЬНЫЙ ПРОФИЛЬ</span>
            </div>
            <form className="diagnostic-main" onSubmit={submit}>
              <div className="diagnostic-topline">
                <span>Шаг {step} из 5</span>
                <button type="button" className="icon-button" aria-label="Закрыть диагностику" onClick={closeDialog} title="Закрыть">
                  <X size={22} />
                </button>
              </div>
              <div className="diagnostic-progress" aria-hidden="true"><span style={{ width: `${step * 20}%` }} /></div>

              {step === 1 && (
                <fieldset>
                  <legend id="diagnostic-title">Что вы слышите?</legend>
                  <p className="form-intro">Начнём с симптома. Это ещё не инженерный диагноз.</p>
                  <div className="choice-grid choice-grid-wide">
                    {[...noiseProfiles, { slug: "other" as const, label: "Другой шум" }].map((item, index) => (
                      <label className={state.symptom === item.slug ? "choice selected" : "choice"} key={item.slug}>
                        <input type="radio" name="symptom" value={item.slug} checked={state.symptom === item.slug} onChange={() => setField("symptom", item.slug)} />
                        <span className="choice-index">0{index + 1}</span>
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 2 && (
                <div>
                  <h2 id="diagnostic-title">Откуда и когда приходит шум?</h2>
                  <p className="form-intro">Направление помогает построить первую карту передачи.</p>
                  <ChoiceField label="Направление" name="direction" value={state.direction} options={[["above", "Сверху"], ["side", "Сбоку"], ["below", "Снизу"], ["street", "С улицы"], ["unclear", "Непонятно"]]} onChange={(value) => setField("direction", value)} />
                  <ChoiceField label="Когда слышно" name="pattern" value={state.pattern} options={[["constant", "Постоянно"], ["evening", "Вечером"], ["night", "Ночью"], ["episodic", "Эпизодически"]]} onChange={(value) => setField("pattern", value)} />
                  <ChoiceField label="Где слышно" name="rooms" value={state.rooms} options={[["one", "Одна комната"], ["several", "Несколько комнат"], ["all", "Вся квартира"]]} onChange={(value) => setField("rooms", value)} />
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 id="diagnostic-title">На каком этапе квартира?</h2>
                  <p className="form-intro">От этого зависит доступ к узлам и допустимый сценарий вмешательства.</p>
                  <ChoiceField label="Этап" name="stage" value={state.stage} options={[["new", "Новостройка до ремонта"], ["repair", "Ремонт идёт"], ["finished", "Готовая квартира"]]} onChange={(value) => setField("stage", value)} />
                  <div className="field-row">
                    <label>Тип дома, если известен<input value={state.building} onChange={(event) => setField("building", event.target.value)} placeholder="Монолит, панель, кирпич…" /></label>
                    <label>Примерная зона, м²<input inputMode="decimal" value={state.area} onChange={(event) => setField("area", event.target.value)} placeholder="Например, 18" /></label>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 id="diagnostic-title">Приложите материалы, если они есть</h2>
                  <p className="form-intro">План, фото, короткое видео или аудио помогут подготовиться. Запись с телефона даёт контекст, но не заменяет измерение.</p>
                  <label className="drop-zone">
                    <Paperclip size={28} aria-hidden="true" />
                    <strong>Перетащите или выберите файлы</strong>
                    <span>До 6 файлов и 25 МБ суммарно</span>
                    <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.heic,.mp4,.mov,.m4a,.mp3,.wav" onChange={(event) => { addFiles(event.target.files); event.currentTarget.value = ""; }} />
                  </label>
                  {files.length > 0 && (
                    <ul className="file-list">
                      {files.map((file, index) => (
                        <li key={`${file.name}-${file.lastModified}`}>
                          <FileText size={20} aria-hidden="true" />
                          <span><strong>{file.name}</strong><small>{formatBytes(file.size)}</small></span>
                          <button type="button" className="icon-button" onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Удалить файл ${file.name}`} title="Удалить файл">
                            <Trash2 size={18} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="file-total">{files.length} / {maxFiles} файлов · {formatBytes(totalBytes)} / 25 МБ</p>
                </div>
              )}

              {step === 5 && (
                <div>
                  <h2 id="diagnostic-title">Куда отправить предварительный профиль?</h2>
                  <p className="form-intro">{noiseLabels[state.symptom]}; {directionLabel(state.direction)}. Это предварительный профиль, а не завершённая инженерная диагностика.</p>
                  <div className="field-row">
                    <label>Имя *<input autoComplete="name" value={state.name} onFocus={() => trackEvent("form_start", { location: source })} onChange={(event) => setField("name", event.target.value)} /></label>
                    <label>Телефон *<input type="tel" autoComplete="tel" inputMode="tel" value={state.phone} onChange={(event) => setField("phone", event.target.value)} placeholder="+7 999 000-00-00" /></label>
                  </div>
                  <label>Email<input type="email" autoComplete="email" value={state.email} onChange={(event) => setField("email", event.target.value)} /></label>
                  <ChoiceField label="Предпочтительный контакт" name="contact" value={state.preferredContact} options={[["phone", "Телефон"], ["email", "Email"]]} onChange={(value) => setField("preferredContact", value as "phone" | "email")} />
                  <label className="consent"><input type="checkbox" checked={state.consent} onChange={(event) => setField("consent", event.target.checked)} /><span>Согласен на обработку данных по <a href="/privacy/" target="_blank">политике конфиденциальности</a>.</span></label>
                </div>
              )}

              <p className="form-error" aria-live="polite">{error}</p>
              <div className="diagnostic-actions">
                <button type="button" className="secondary-button" onClick={back}><ArrowLeft size={18} />{step === 1 ? "Закрыть" : "Назад"}</button>
                {step < 5 ? (
                  <button type="button" className="primary-cta" onClick={next}>Продолжить <ArrowRight size={18} /></button>
                ) : (
                  <button type="submit" className="primary-cta" disabled={submitting}>{submitting ? "Отправляем…" : "Записаться на диагностику"}<ArrowRight size={18} /></button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function ChoiceField({ label, name, value, options, onChange }: { label: string; name: string; value: string; options: string[][]; onChange: (value: string) => void }) {
  return (
    <fieldset className="compact-fieldset">
      <legend>{label}</legend>
      <div className="choice-line">
        {options.map(([optionValue, optionLabel]) => (
          <label className={value === optionValue ? "choice selected" : "choice"} key={optionValue}>
            <input type="radio" name={name} value={optionValue} checked={value === optionValue} onChange={() => onChange(optionValue)} />
            <span>{optionLabel}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / 1024 / 1024).toFixed(1)} МБ`;
}

function directionLabel(direction: string) {
  return ({ above: "источник сверху", side: "источник сбоку", below: "источник снизу", street: "источник с улицы", unclear: "направление неясно" } as Record<string, string>)[direction] || "направление неясно";
}

function getScenario(symptom: NoiseSlug, direction: string) {
  if (symptom === "ventilation") return "engineering-system intervention";
  if (symptom === "bass" || direction === "unclear") return "room contour";
  if (symptom === "steps" && direction === "above") return "one surface plus junctions";
  return "local node or one surface plus junctions";
}
