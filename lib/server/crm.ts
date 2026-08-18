type LeadPayload = Record<string, unknown> & {
  name: string;
  phone: string;
  email?: string;
  symptom: string;
  stage?: string;
  timestamp: string;
};

type DeliveryResult = { id: string; mock: boolean };

export async function deliverLead(payload: LeadPayload): Promise<DeliveryResult> {
  const webhook = process.env.BITRIX_WEBHOOK_URL?.trim();
  const entity = process.env.BITRIX_ENTITY_TYPE?.trim();
  const rawMap = process.env.BITRIX_FIELD_MAP_JSON?.trim();

  if (!webhook || !entity || !rawMap) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("CRM delivery is not configured.");
    }
    console.warn("[BITRIX MOCK] Lead accepted in development; no CRM request was sent.");
    return { id: `mock-${Date.now()}`, mock: true };
  }

  let fieldMap: Record<string, string>;
  try {
    fieldMap = JSON.parse(rawMap) as Record<string, string>;
  } catch {
    throw new Error("BITRIX_FIELD_MAP_JSON is invalid.");
  }

  const fields: Record<string, unknown> = {};
  for (const [internalKey, bitrixKey] of Object.entries(fieldMap)) {
    const value = payload[internalKey];
    if (value === undefined || value === null || value === "") continue;
    if (bitrixKey === "PHONE") fields[bitrixKey] = [{ VALUE: value, VALUE_TYPE: "WORK" }];
    else if (bitrixKey === "EMAIL") fields[bitrixKey] = [{ VALUE: value, VALUE_TYPE: "WORK" }];
    else fields[bitrixKey] = Array.isArray(value) || typeof value === "object" ? JSON.stringify(value) : value;
  }

  const title = `Шумоизоляция — ${String(payload.symptom)} — ${String(payload.stage || "этап не указан")} — ${payload.name}`;
  if (fieldMap.title) fields[fieldMap.title] = title;

  const endpoint = bitrixEndpoint(webhook, entity);
  const body = entity.startsWith("spa:")
    ? { entityTypeId: Number(entity.split(":")[1]), fields }
    : { fields };
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json().catch(() => null) as { result?: unknown; error_description?: string } | null;
  if (!response.ok || !result || result.error_description || result.result === undefined) {
    throw new Error(result?.error_description || `CRM delivery failed with status ${response.status}.`);
  }
  const id = typeof result.result === "object" && result.result && "item" in result.result
    ? String((result.result as { item?: { id?: string | number } }).item?.id || "created")
    : String(result.result);
  return { id, mock: false };
}

function bitrixEndpoint(webhook: string, entity: string) {
  const base = webhook.replace(/\/+$/, "");
  if (/\.json$/i.test(base)) return base;
  if (entity === "lead") return `${base}/crm.lead.add.json`;
  if (entity === "deal") return `${base}/crm.deal.add.json`;
  if (entity.startsWith("spa:")) return `${base}/crm.item.add.json`;
  throw new Error("BITRIX_ENTITY_TYPE must be lead, deal, or spa:<entityTypeId>.");
}

