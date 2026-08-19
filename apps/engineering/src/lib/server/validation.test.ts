import { describe, expect, it } from 'vitest';
import { parseDiagnosis } from './validation';
import { validateFiles } from '$lib/file-policy';

function validForm(): FormData {
  const form = new FormData();
  form.set('heard', 'Шаги сверху');
  form.set('direction', 'сверху');
  form.set('timing', 'вечером');
  form.set('rooms', 'спальня');
  form.set('stage', 'ремонт идёт');
  form.set('name', 'Иван');
  form.set('phone', '+7 999 123-45-67');
  form.set('email', 'owner@example.com');
  form.set('consent', 'yes');
  return form;
}

describe('diagnosis validation', () => {
  it('accepts a complete diagnosis request', () => {
    const result = parseDiagnosis(validForm());
    expect(result.errors).toEqual([]);
    expect(result.data?.heard).toBe('Шаги сверху');
  });

  it('rejects missing consent and malformed contacts', () => {
    const form = validForm();
    form.delete('consent');
    form.set('phone', '12');
    form.set('email', 'wrong');
    const result = parseDiagnosis(form);
    expect(result.data).toBeUndefined();
    expect(result.errors).toContain('Проверьте номер телефона.');
    expect(result.errors).toContain('Проверьте email.');
    expect(result.errors).toContain('Нужно согласие на обработку данных.');
  });

  it('validates file type and size', () => {
    const wrong = new File(['payload'], 'unsafe.exe', { type: 'application/octet-stream' });
    const disguised = new File(['payload'], 'photo.jpg', { type: 'application/octet-stream' });
    const tooLarge = new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'plan.pdf', { type: 'application/pdf' });
    const errors = validateFiles([wrong, disguised, tooLarge]);
    expect(errors.filter((message) => message.includes('не поддерживается'))).toHaveLength(2);
    expect(errors.some((message) => message.includes('больше 10 МБ'))).toBe(true);
  });
});
