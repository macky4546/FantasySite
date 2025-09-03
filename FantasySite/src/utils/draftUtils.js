export function normalizePosition(position) {
  if (!position) return '';
  const p = String(position).toUpperCase();
  if (p === 'DST') return 'D/ST';
  if (p === 'DP') return 'DP';
  return p;
}

// Returns a slot string (QB, RB, WR, TE, FLEX, DP, D/ST, K, Bench) or null if none available.
export function determineSlotForPlayer(team, player) {
  if (!team || !player) return null;
  const pos = normalizePosition(player.position);

  // direct position slot available?
  if (pos && team.rosterSlots[pos] && (team.rosterSlots[pos].current || 0) < (team.rosterSlots[pos].max || 0)) {
    return pos;
  }

  // FLEX rule for RB/WR/TE
  if (['RB', 'WR', 'TE'].includes(pos) && team.rosterSlots.FLEX && (team.rosterSlots.FLEX.current || 0) < (team.rosterSlots.FLEX.max || 0)) {
    return 'FLEX';
  }

  // Defensive mapping: DP or D/ST
  if (pos === 'D/ST' && team.rosterSlots['D/ST'] && (team.rosterSlots['D/ST'].current || 0) < (team.rosterSlots['D/ST'].max || 0)) {
    return 'D/ST';
  }
  if (pos === 'DP' && team.rosterSlots.DP && (team.rosterSlots.DP.current || 0) < (team.rosterSlots.DP.max || 0)) {
    return 'DP';
  }

  // Bench fallback
  if (team.rosterSlots.Bench && (team.rosterSlots.Bench.current || 0) < (team.rosterSlots.Bench.max || 0)) {
    return 'Bench';
  }

  return null;
}

// Returns a new rosterSlots object with the chosen slot incremented, or null if invalid.
export function allocateRosterSlot(rosterSlots, slotType) {
  if (!slotType || !rosterSlots[slotType]) return null;
  const current = rosterSlots[slotType].current || 0;
  const max = rosterSlots[slotType].max || 0;
  if (current >= max) return null;
  return {
    ...rosterSlots,
    [slotType]: {
      ...rosterSlots[slotType],
      current: current + 1
    }
  };
}