import { get } from 'svelte/store';
import { beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => vi.resetModules());

describe('project context invariants', () => {
  it('replaces zones when an untouched route object changes', async () => {
    const context = await import('./projectContext');
    context.applyLandingDefaults({ objectType: 'shift' });
    context.toggleProjectZone('Столовая');
    context.applyLandingDefaults({ objectType: 'abk' });

    const value = get(context.projectContext);
    expect(value.objectType).toBe('abk');
    expect(value.zonesObjectType).toBe('abk');
    expect(value.selectedZones).toContain('Рабочие места');
    expect(value.selectedZones).not.toContain('Общежития');
  });

  it('makes query intent transient when a query-free route follows', async () => {
    const context = await import('./projectContext');
    context.setObjectType('shift');
    context.applyLandingDefaults({ objectType: 'service', typeIntent: 'Контекст КПП' });
    expect(get(context.projectContext).edited.objectType).toBe(false);

    context.applyLandingDefaults({ objectType: 'abk' });
    expect(get(context.projectContext).objectType).toBe('abk');
  });

  it('records explicit transfer revisions and clears composition atomically', async () => {
    const context = await import('./projectContext');
    context.setObjectType('dorm');
    const before = get(context.projectContext).transferRevision;
    context.commitProjectTransfer();
    expect(get(context.projectContext).transferRevision).toBe(before + 1);

    context.clearObjectType();
    const cleared = get(context.projectContext);
    expect(cleared.objectType).toBe('');
    expect(cleared.selectedZones).toEqual([]);
    expect(cleared.capacity).toBe('');
  });
});
