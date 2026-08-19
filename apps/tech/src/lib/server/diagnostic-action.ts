import { fail } from '@sveltejs/kit';
import { formDataToDiagnostic, validateFiles } from '$lib/diagnostic';
import { sendToBitrix } from '$lib/server/bitrix';

export async function processDiagnostic(formData: FormData) {
  const parsed = formDataToDiagnostic(formData);
  const files = formData.getAll('files').filter((value): value is File => value instanceof File && value.size > 0);
  const fileErrors = validateFiles(files);

  if (!parsed.success || fileErrors.length) {
    const fields = parsed.success ? {} : parsed.error.flatten().fieldErrors;
    return fail(400, {
      success: false,
      message: 'Проверьте отмеченные поля.',
      issues: { ...fields, files: fileErrors }
    });
  }

  try {
    const result = await sendToBitrix(parsed.data, files);
    return {
      success: true,
      message: 'Заявка принята. Менеджер свяжется с вами и согласует следующий шаг — выездную диагностику.',
      reference: result.id,
      developmentMock: result.mode === 'development-mock'
    };
  } catch (error) {
    console.error('[tech diagnostic error]', error);
    return fail(502, {
      success: false,
      message: 'Не удалось передать заявку. Данные сохранены в форме — попробуйте ещё раз или свяжитесь с нами по телефону.',
      issues: {}
    });
  }
}
