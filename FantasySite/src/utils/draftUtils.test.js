import { determineSlotForPlayer, allocateRosterSlot } from './draftUtils';

describe('determineSlotForPlayer', () => {
  const baseTeam = {
    rosterSlots: {
      QB: { current: 0, max: 1 },
      RB: { current: 0, max: 1 },
      WR: { current: 1, max: 1 },
      TE: { current: 0, max: 1 },
      FLEX: { current: 0, max: 1 },
      DP: { current: 0, max: 1 },
      'D/ST': { current: 0, max: 1 },
      K: { current: 0, max: 1 },
      Bench: { current: 0, max: 2 },
    }
  };

  test('picks direct position slot when available', () => {
    const player = { position: 'QB' };
    expect(determineSlotForPlayer(baseTeam, player)).toBe('QB');
  });

  test('uses FLEX when position slot full but FLEX available', () => {
    const team = {
      rosterSlots: { ...baseTeam.rosterSlots, RB: { current: 1, max: 1 }, FLEX: { current: 0, max: 1 } }
    };
    const player = { position: 'RB' };
    expect(determineSlotForPlayer(team, player)).toBe('FLEX');
  });

  test('falls back to Bench when no position/FLEX available', () => {
    const team = {
      rosterSlots: {
        ...baseTeam.rosterSlots,
        RB: { current: 1, max: 1 },
        FLEX: { current: 1, max: 1 },
        Bench: { current: 0, max: 2 }
      }
    };
    const player = { position: 'RB' };
    expect(determineSlotForPlayer(team, player)).toBe('Bench');
  });

  test('returns null when no slots available', () => {
    const team = {
      rosterSlots: {
        ...baseTeam.rosterSlots,
        RB: { current: 1, max: 1 },
        FLEX: { current: 1, max: 1 },
        Bench: { current: 2, max: 2 }
      }
    };
    const player = { position: 'RB' };
    expect(determineSlotForPlayer(team, player)).toBeNull();
  });

  test('maps DST correctly', () => {
    const player = { position: 'DST' };
    expect(determineSlotForPlayer(baseTeam, player)).toBe('D/ST');
  });
});

describe('allocateRosterSlot', () => {
  test('increments slot current when available', () => {
    const slots = { Bench: { current: 0, max: 2 } };
    const updated = allocateRosterSlot(slots, 'Bench');
    expect(updated.Bench.current).toBe(1);
  });

  test('returns null when slot full or invalid', () => {
    const slots = { Bench: { current: 2, max: 2 } };
    expect(allocateRosterSlot(slots, 'Bench')).toBeNull();
    expect(allocateRosterSlot(slots, 'NonExistent')).toBeNull();
  });
});