import { describe, expect, it } from 'vitest';
import { sanitizeAttributionRecord, sanitizeEventDetail } from './analytics';

describe('analytics privacy boundary', () => {
  it('allowlists persisted attribution and rejects poisoned personal fields', () => {
    expect(sanitizeAttributionRecord({
      utm_source: 'safe',
      route: '/modulnye-zdaniya/',
      type: 'office',
      region: 'sibir',
      landing_variant: 'type:office',
      referrer: 'https://example.test/path?secret=1',
      name: 'Sensitive Name',
      phone: '123',
      email: 'secret@example.test',
      company: 'Secret',
      filename: 'secret.pdf',
      comment: 'private',
      arbitrary: 'poison'
    })).toEqual({
      utm_source: 'safe',
      route: '/modulnye-zdaniya/',
      type: 'office',
      region: 'sibir',
      landing_variant: 'type:office',
      referrer: 'https://example.test/path'
    });
  });

  it('applies a final personal-data filter after payload merging', () => {
    expect(sanitizeEventDetail({
      placement: 'footer',
      route: '/modulnye-zdaniya/',
      name: 'Sensitive Name',
      phone: '123',
      contact_value: 'secret@example.test',
      filename: 'secret.pdf',
      comment: 'private',
      infinite: Number.POSITIVE_INFINITY
    })).toEqual({ placement: 'footer', route: '/modulnye-zdaniya/' });
  });

  it('drops unknown route and query taxonomies from attribution', () => {
    expect(sanitizeAttributionRecord({
      route: '/unknown/',
      type: 'poison',
      region: 'moon',
      landing_variant: 'type:poison',
      yclid: 'safe-id'
    })).toEqual({ yclid: 'safe-id' });
  });
});
