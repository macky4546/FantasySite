const initialTeams = [
  {
    id: 1, name: 'Jeremy', owner: 'Jeremy', roster: [],
    rosterSlots: {
      QB: { current: 0, max: 1 },
      RB: { current: 0, max: 2 },
      WR: { current: 0, max: 2 },
      TE: { current: 0, max: 1 },
      FLEX: { current: 0, max: 1 },
      DP: { current: 0, max: 1 },
      'D/ST': { current: 0, max: 1 },
      K: { current: 0, max: 1 },
      Bench: { current: 0, max: 5 },
      IR: { current: 0, max: 1 }
    }
  },
  { id: 2, name: 'CDUB', owner: 'CDUB', roster: [], rosterSlots: { QB: { current: 0, max: 1 }, RB: { current: 0, max: 2 }, WR: { current: 0, max: 2 }, TE: { current: 0, max: 1 }, FLEX: { current: 0, max: 1 }, DP: { current: 0, max: 1 }, 'D/ST': { current: 0, max: 1 }, K: { current: 0, max: 1 }, Bench: { current: 0, max: 5 }, IR: { current: 0, max: 1 } } },
  { id: 3, name: 'Angel', owner: 'Angel', roster: [], rosterSlots: { QB: { current: 0, max: 1 }, RB: { current: 0, max: 2 }, WR: { current: 0, max: 2 }, TE: { current: 0, max: 1 }, FLEX: { current: 0, max: 1 }, DP: { current: 0, max: 1 }, 'D/ST': { current: 0, max: 1 }, K: { current: 0, max: 1 }, Bench: { current: 0, max: 5 }, IR: { current: 0, max: 1 } } },
  { id: 4, name: 'G', owner: 'G', roster: [], rosterSlots: { QB: { current: 0, max: 1 }, RB: { current: 0, max: 2 }, WR: { current: 0, max: 2 }, TE: { current: 0, max: 1 }, FLEX: { current: 0, max: 1 }, DP: { current: 0, max: 1 }, 'D/ST': { current: 0, max: 1 }, K: { current: 0, max: 1 }, Bench: { current: 0, max: 5 }, IR: { current: 0, max: 1 } } },
  { id: 5, name: 'ROB', owner: 'ROB', roster: [], rosterSlots: { QB: { current: 0, max: 1 }, RB: { current: 0, max: 2 }, WR: { current: 0, max: 2 }, TE: { current: 0, max: 1 }, FLEX: { current: 0, max: 1 }, DP: { current: 0, max: 1 }, 'D/ST': { current: 0, max: 1 }, K: { current: 0, max: 1 }, Bench: { current: 0, max: 5 }, IR: { current: 0, max: 1 } } },
  { id: 6, name: 'Rios', owner: 'Rios', roster: [], rosterSlots: { QB: { current: 0, max: 1 }, RB: { current: 0, max: 2 }, WR: { current: 0, max: 2 }, TE: { current: 0, max: 1 }, FLEX: { current: 0, max: 1 }, DP: { current: 0, max: 1 }, 'D/ST': { current: 0, max: 1 }, K: { current: 0, max: 1 }, Bench: { current: 0, max: 5 }, IR: { current: 0, max: 1 } } },
  { id: 7, name: 'Howard', owner: 'Howard', roster: [], rosterSlots: { QB: { current: 0, max: 1 }, RB: { current: 0, max: 2 }, WR: { current: 0, max: 2 }, TE: { current: 0, max: 1 }, FLEX: { current: 0, max: 1 }, DP: { current: 0, max: 1 }, 'D/ST': { current: 0, max: 1 }, K: { current: 0, max: 1 }, Bench: { current: 0, max: 5 }, IR: { current: 0, max: 1 } } },
  { id: 8, name: 'Yata', owner: 'Yata', roster: [], rosterSlots: { QB: { current: 0, max: 1 }, RB: { current: 0, max: 2 }, WR: { current: 0, max: 2 }, TE: { current: 0, max: 1 }, FLEX: { current: 0, max: 1 }, DP: { current: 0, max: 1 }, 'D/ST': { current: 0, max: 1 }, K: { current: 0, max: 1 }, Bench: { current: 0, max: 5 }, IR: { current: 0, max: 1 } } },
  { id: 9, name: 'Jesse', owner: 'Jesse', roster: [], rosterSlots: { QB: { current: 0, max: 1 }, RB: { current: 0, max: 2 }, WR: { current: 0, max: 2 }, TE: { current: 0, max: 1 }, FLEX: { current: 0, max: 1 }, DP: { current: 0, max: 1 }, 'D/ST': { current: 0, max: 1 }, K: { current: 0, max: 1 }, Bench: { current: 0, max: 5 }, IR: { current: 0, max: 1 } } },
  { id: 10, name: 'Ciurleo', owner: 'Ciurleo', roster: [], rosterSlots: { QB: { current: 0, max: 1 }, RB: { current: 0, max: 2 }, WR: { current: 0, max: 2 }, TE: { current: 0, max: 1 }, FLEX: { current: 0, max: 1 }, DP: { current: 0, max: 1 }, 'D/ST': { current: 0, max: 1 }, K: { current: 0, max: 1 }, Bench: { current: 0, max: 5 }, IR: { current: 0, max: 1 } } },
  { id: 11, name: 'Josh', owner: 'Josh', roster: [], rosterSlots: { QB: { current: 0, max: 1 }, RB: { current: 0, max: 2 }, WR: { current: 0, max: 2 }, TE: { current: 0, max: 1 }, FLEX: { current: 0, max: 1 }, DP: { current: 0, max: 1 }, 'D/ST': { current: 0, max: 1 }, K: { current: 0, max: 1 }, Bench: { current: 0, max: 5 }, IR: { current: 0, max: 1 } } },
  { id: 12, name: 'Dion', owner: 'Dion', roster: [], rosterSlots: { QB: { current: 0, max: 1 }, RB: { current: 0, max: 2 }, WR: { current: 0, max: 2 }, TE: { current: 0, max: 1 }, FLEX: { current: 0, max: 1 }, DP: { current: 0, max: 1 }, 'D/ST': { current: 0, max: 1 }, K: { current: 0, max: 1 }, Bench: { current: 0, max: 5 }, IR: { current: 0, max: 1 } } },
];

export default initialTeams;