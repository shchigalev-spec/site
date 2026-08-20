import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createBitrixLead } from '$lib/server/bitrix';
import { parseDiagnosis } from '$lib/server/validation';

export const POST: RequestHandler = async ({ request }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, message: 'Не удалось прочитать данные формы.' }, { status: 400 });
  }

  const parsed = parseDiagnosis(form);
  if (!parsed.data) return json({ ok: false, errors: parsed.errors }, { status: 400 });

  try {
    await createBitrixLead(parsed.data);
    return json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('[engineering diagnosis] submit failed', error);
    return json({ ok: false, message: 'Заявка не принята сервером. Сохраните введённые данные и попробуйте ещё раз или свяжитесь с нами по телефону.' }, { status: 502 });
  }
};
