import { deliverLead } from "../../../lib/server/crm";

export const runtime = "edge";

const maxFiles = 6;
const maxBytes = 25 * 1024 * 1024;
const extensions = new Set(["pdf", "jpg", "jpeg", "png", "heic", "mp4", "mov", "m4a", "mp3", "wav"]);

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) return jsonError("Ожидалась форма с данными заявки.", 415);
    const form = await request.formData();
    const rawPayload = form.get("payload");
    if (typeof rawPayload !== "string") return jsonError("Данные заявки не найдены.", 400);

    let input: Record<string, unknown>;
    try {
      input = JSON.parse(rawPayload) as Record<string, unknown>;
    } catch {
      return jsonError("Не удалось прочитать данные заявки.", 400);
    }

    const name = clean(input.name, 120);
    const phone = normalizePhone(clean(input.phone, 40));
    const email = normalizeEmail(clean(input.email, 180));
    if (!name) return jsonError("Укажите имя.", 400);
    if (phone.replace(/\D/g, "").length < 10) return jsonError("Проверьте номер телефона.", 400);
    if (input.preferredContact === "email" && !email) return jsonError("Укажите корректный email.", 400);
    if (input.consent !== true) return jsonError("Нужно согласие на обработку данных.", 400);

    const files = form.getAll("files").filter((item): item is File => item instanceof File);
    if (files.length > maxFiles) return jsonError(`Можно приложить не более ${maxFiles} файлов.`, 400);
    let total = 0;
    const metadata = [];
    for (const file of files) {
      total += file.size;
      const extension = file.name.split(".").pop()?.toLowerCase() || "";
      if (!extensions.has(extension)) return jsonError("Один из файлов имеет неподдерживаемый формат.", 400);
      if (total > maxBytes) return jsonError("Общий размер файлов превышает 25 МБ.", 400);
      metadata.push({ name: clean(file.name, 180), type: clean(file.type, 100), size: file.size });
    }

    const safePayload = {
      name,
      phone,
      email,
      symptom: clean(input.symptom, 40),
      stage: clean(input.stage, 40),
      surface: clean(input.surface, 40),
      direction: clean(input.direction, 40),
      pattern: clean(input.pattern, 40),
      rooms: clean(input.rooms, 40),
      building: clean(input.building, 120),
      area: clean(input.area, 30),
      scenario: clean(input.scenario, 160),
      preferredContact: clean(input.preferredContact, 20),
      route: clean(input.route, 240),
      referrer: clean(input.referrer, 500),
      source: clean(input.source, 100),
      utm_source: clean(input.utm_source, 200),
      utm_medium: clean(input.utm_medium, 200),
      utm_campaign: clean(input.utm_campaign, 200),
      utm_content: clean(input.utm_content, 200),
      utm_term: clean(input.utm_term, 200),
      timestamp: new Date().toISOString(),
      file_metadata: metadata,
    };

    const delivery = await deliverLead(safePayload);
    return Response.json({ ok: true, id: delivery.id, mock: delivery.mock }, { status: 201 });
  } catch (error) {
    const message = process.env.NODE_ENV === "production"
      ? "Не удалось передать заявку. Данные сохранены в форме — попробуйте ещё раз."
      : error instanceof Error ? error.message : "Не удалось обработать заявку.";
    return jsonError(message, 502);
  }
}

function clean(value: unknown, maxLength: number) {
  return typeof value === "string"
    ? [...value].map((character) => {
        const code = character.charCodeAt(0);
        return code < 32 || code === 127 ? " " : character;
      }).join("").trim().slice(0, maxLength)
    : "";
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11 && (digits.startsWith("8") || digits.startsWith("7"))) return `+7${digits.slice(1)}`;
  return digits ? `+${digits}` : "";
}

function normalizeEmail(value: string) {
  const normalized = value.toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) ? normalized : "";
}

function jsonError(error: string, status: number) {
  return Response.json({ ok: false, error }, { status });
}
