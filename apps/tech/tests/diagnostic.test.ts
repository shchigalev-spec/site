import { describe, expect, it } from 'vitest';
import { diagnosticSchema, MAX_FILE_SIZE, validateFiles } from '../src/lib/diagnostic';

const validPayload = {
  heard: 'Топот сверху',
  direction: 'сверху',
  timing: 'вечером',
  rooms: 'спальня',
  stage: 'finished',
  building: '',
  area: '',
  comment: '',
  name: 'Иван',
  phone: '+7 999 000-00-00',
  email: '',
  consent: 'on'
};

describe('diagnostic validation', () => {
  it('accepts the complete required payload', () => {
    expect(diagnosticSchema.safeParse(validPayload).success).toBe(true);
  });

  it('rejects missing consent and malformed phone', () => {
    const result = diagnosticSchema.safeParse({ ...validPayload, consent: '', phone: '12' });
    expect(result.success).toBe(false);
  });

  it('accepts the short homepage payload without invented diagnostic detail', () => {
    const { direction: _direction, timing: _timing, rooms: _rooms, ...shortPayload } = validPayload;
    expect(diagnosticSchema.safeParse({ ...shortPayload, formMode: 'short' }).success).toBe(true);
  });

  it('keeps route, timing and room required in the full diagnostic flow', () => {
    expect(diagnosticSchema.safeParse({ ...validPayload, formMode: 'full', direction: '', timing: '', rooms: '' }).success).toBe(false);
  });

  it('validates attachment extension, type and size', () => {
    expect(validateFiles([{ name: 'plan.pdf', type: 'application/pdf', size: 1024 }])).toEqual([]);
    expect(validateFiles([{ name: 'archive.exe', type: 'application/octet-stream', size: 1024 }])[0]).toContain('неподдерживаемый');
    expect(validateFiles([{ name: 'video.mp4', type: 'video/mp4', size: MAX_FILE_SIZE + 1 }])[0]).toContain('10 МБ');
  });
});
