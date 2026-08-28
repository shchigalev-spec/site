import { describe, expect, it } from 'vitest';
import { parseLead } from './lead-adapter';

function standardLead() {
  const form = new FormData();
  form.set('mode', 'standard');
  form.set('objectType', 'abk');
  form.set('capacityMetric', 'workplaces');
  form.set('personnelCount', '300');
  form.set('region', 'siberia');
  form.set('phone', '+7 900 000 00 00');
  form.set('consent', 'on');
  form.append('functionalZones[]', 'Рабочие места');
  form.append('functionalZones[]', 'Санитарные зоны');
  return form;
}

describe('parseLead', () => {
  it('preserves the typed project composition', () => {
    const result = parseLead(standardLead());
    expect(result.errors).toEqual({});
    expect(result.lead?.mode).toBe('standard');
    expect(result.lead?.fields.capacityMetric).toBe('workplaces');
    expect(result.lead?.functionalZones).toEqual(['Рабочие места', 'Санитарные зоны']);
  });

  it('normalizes a tender invitation and requires tender fields', () => {
    const form = standardLead();
    form.set('tenderInvitation', 'true');
    const result = parseLead(form);
    expect(result.lead).toBeUndefined();
    expect(result.errors).toMatchObject({ company: expect.any(String), tenderName: expect.any(String), deadline: expect.any(String) });
  });

  it('maps malformed contact and capacity input to field errors', () => {
    const form = standardLead();
    form.set('phone', '');
    form.set('email', 'wrong');
    form.set('personnelCount', '1.5');
    const result = parseLead(form);
    expect(result.errors.email).toBeTruthy();
    expect(result.errors.personnelCount).toBeTruthy();
  });

  it('rejects implausible phones and unknown project taxonomies', () => {
    const form = standardLead();
    form.set('phone', 'x');
    form.set('objectType', '<script>');
    form.set('capacityMetric', 'bogus');
    form.set('region', 'outer-space');
    form.set('projectStage', 'already promised');
    form.append('scope[]', 'Secret scope');
    form.append('functionalZones[]', 'Unknown zone');
    const result = parseLead(form);
    expect(result.lead).toBeUndefined();
    expect(result.errors).toMatchObject({
      phone: expect.any(String),
      contact: expect.any(String),
      objectType: expect.any(String),
      capacityMetric: expect.any(String),
      region: expect.any(String),
      projectStage: expect.any(String),
      scope: expect.any(String),
      functionalZones: expect.any(String)
    });
  });

  it('rejects malformed tender dates', () => {
    const form = standardLead();
    form.set('mode', 'tender');
    form.set('tenderInvitation', 'true');
    form.set('company', 'Тест');
    form.set('tenderName', 'Процедура');
    form.set('deadline', 'not-a-date');
    const result = parseLead(form);
    expect(result.lead).toBeUndefined();
    expect(result.errors.deadline).toBeTruthy();
  });

  it('accepts commissioning shortcuts and an exact month, but rejects unknown values', () => {
    for (const commissioning of ['Срочно', '1–3 месяца', '3–6 месяцев', '6–12 месяцев', '2027-02']) {
      const form = standardLead();
      form.set('desiredCommissioningDate', commissioning);
      const result = parseLead(form);
      expect(result.errors.desiredCommissioningDate).toBeUndefined();
      expect(result.lead?.fields.desiredCommissioningDate).toBe(commissioning);
    }

    const invalid = standardLead();
    invalid.set('desiredCommissioningDate', 'когда получится');
    expect(parseLead(invalid).errors.desiredCommissioningDate).toBeTruthy();
  });

  it('discards unknown query variants before forwarding', () => {
    const form = standardLead();
    form.set('landingRoute', '/unknown/');
    form.set('typeVariant', 'poison');
    form.set('regionSlug', 'moon');
    form.set('landing_variant', 'type:poison');
    form.set('pageUrl', 'https://example.test/modulnye-ofisy-abk/?type=poison&region=moon&utm_source=safe');
    form.set('referrer', 'javascript:alert(1)');
    const result = parseLead(form);
    expect(result.errors).toEqual({});
    expect(result.lead?.fields).toMatchObject({
      landingRoute: '',
      typeVariant: '',
      regionSlug: '',
      landing_variant: '',
      pageUrl: 'https://example.test/modulnye-ofisy-abk/?utm_source=safe',
      referrer: ''
    });
  });
});
