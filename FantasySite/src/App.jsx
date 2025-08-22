import React, { useState, useEffect, useRef } from "react";

// --- Mock Data (unchanged except: keep "D/ST" consistent everywhere) ---
const mockPlayersData = [
  { id: 1, name: "Ja'Marr Chase", position: "WR", team: "CIN", adp: 1.41, tier: "Tier 1" },
  { id: 2, name: "Bijan Robinson", position: "RB", team: "ATL", adp: 2.19, tier: "Tier 1" },
  { id: 3, name: "Saquon Barkley", position: "RB", team: "PHI", adp: 4.49, tier: "Tier 1" },
  { id: 4, name: "Justin Jefferson", position: "WR", team: "MIN", adp: 4.63, tier: "Tier 1" },
  { id: 5, name: "Jahmyr Gibbs", position: "RB", team: "DET", adp: 5.17, tier: "Tier 1" },
  { id: 6, name: "CeeDee Lamb", position: "WR", team: "DAL", adp: 5.36, tier: "Tier 1" },
  { id: 7, name: "Puka Nacua", position: "WR", team: "LAR", adp: 8.71, tier: "Tier 2" },
  { id: 8, name: "Malik Nabers", position: "WR", team: "NYG", adp: 9.21, tier: "Tier 2" },
  { id: 9, name: "Nico Collins", position: "WR", team: "HOU", adp: 10.63, tier: "Tier 2" },
  { id: 10, name: "Amon-Ra St. Brown", position: "WR", team: "DET", adp: 11.33, tier: "Tier 2" },
  // ... keep the rest of your massive list as-is ...
  { id: 200, name: "Brandon Aubrey", position: "K", team: "DAL", adp: 189.46, tier: "Tier 24" },
];

// --- Teams (unchanged) ---
const initialTeams = [
  {
    id: 1, name: "Jeremy", owner: "Jeremy", roster: [],
    rosterSlots: {
      QB: { current: 0, max: 1 },
      RB: { current: 0, max: 2 },
      WR: { current: 0, max: 2 },
      TE: { current: 0, max: 1 },
      FLEX: { current: 0, max: 1 },
      DP: { current: 0, max: 1 },
      "D/ST": { current: 0, max: 1 },
      K: { current: 0, max: 1 },
      Bench: { current: 0, max: 5 },
      IR: { current: 0, max: 1 }
    }
  },
  // ... keep the rest of your team block unchanged ...
  {
    id: 12, name: "Dion", owner: "Dion", roster: [],
    rosterSlots: {
      QB: { current: 0, max: 1 }, RB: { current: 0, max: 2 }, WR: { current: 0, max: 2 },
      TE: { current: 0, max: 1 }, FLEX: { current: 0, max: 1 }, DP: { current: 0, max: 1 },
      "D/ST": { current: 0, max: 1 }, K: { current: 0, max: 1 }, Bench: { current: 0, max: 5 },
      IR: { current: 0, max: 1 }
    }
  },
];

const App = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState(initialTeams);
  const [draftOrder, setDraftOrder] = useState([]);
  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [draftStarted, setDraftStarted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [playerToDraft, setPlayerToDraft] = useState(null);
  const [teamToDraftTo, setTeamToDraftTo] = useState(null);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
  const [draftHistory, setDraftHistory] = useState([]);
  const [expandedTiers, setExpandedTiers] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    draftStatus: true,
    aiInsights: true,
    draftedPlayers: true,
    teamRosters: true,
  });
  const [message, setMessage] = useState("");
  const messageTimeoutRef = useRef(null);
  const playerListRef = useRef(null);

  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      setPlayers(mockPlayersData);
      setIsLoadingPlayers(false);
    }, 600);
  }, []);

  useEffect(() => {
    if (isLoadingPlayers) return;
    const order = [];
    const numTeams = teams.length;
    const numRounds = 15;
    for (let round = 0; round < numRounds; round++) {
      if (round % 2 === 0) for (let i = 0; i < numTeams; i++) order.push(teams[i].id);
      else for (let i = numTeams - 1; i >= 0; i--) order.push(teams[i].id);
    }
    setDraftOrder(order);
  }, [teams, isLoadingPlayers]);

  const currentTeamId = draftOrder[currentPickIndex];
  const currentTeam = teams.find((t) => t.id === currentTeamId);

  const showTemporaryMessage = (msg) => {
    setMessage(msg);
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    messageTimeoutRef.current = setTimeout(() => setMessage(""), 3000);
  };

  const availablePlayers = players.filter(
    (p) => !p.isDrafted && p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const playersByTier = availablePlayers.reduce((acc, p) => {
    const tier = p.tier || "Uncategorized";
    (acc[tier] ||= []).push(p);
    return acc;
  }, {});

  const sortedTiers = Object.keys(playersByTier).sort((a, b) => {
    const na = parseInt(a.match(/Tier (\d+)/)?.[1]) || Infinity;
    const nb = parseInt(b.match(/Tier (\d+)/)?.[1]) || Infinity;
    return na !== nb ? na - nb : a.localeCompare(b);
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (playerListRef.current) playerListRef.current.scrollTop = 0;
  };

  const handleStartDraft = () => {
    setDraftStarted(true);
    setPlayers((prev) => [...prev].sort((a, b) => a.adp - b.adp));
    const openAll = sortedTiers.reduce((m, t) => ((m[t] = true), m), {});
    setExpandedTiers(openAll);
  };

  const handleDraftPlayer = (player, team) => {
    if (!team) return showTemporaryMessage("No team is currently on the clock.");
    const currentRoster = team.rosterSlots;
    let draftedSlotType = "";

    if (currentRoster[player.position]?.current < currentRoster[player.position]?.max) {
      draftedSlotType = player.position;
    } else if (["RB", "WR", "TE"].includes(player.position) && currentRoster.FLEX.current < currentRoster.FLEX.max) {
      draftedSlotType = "FLEX";
    } else if (currentRoster.Bench.current < currentRoster.Bench.max) {
      draftedSlotType = "Bench";
    } else {
      return showTemporaryMessage(`${team.name} has no available ${player.position}, FLEX, or Bench slots for ${player.name}.`);
    }

    setPlayerToDraft({ ...player, draftedSlotType });
    setTeamToDraftTo(team);
    setShowConfirmation(true);
  };

  const confirmDraft = () => {
    if (!playerToDraft || !teamToDraftTo) return;

    const draftedPlayer = {
      ...playerToDraft,
      isDrafted: true,
      draftedBy: teamToDraftTo.id,
      draftedPickNumber: currentPickIndex + 1,
    };

    setPlayers((prev) => prev.map((p) => (p.id === draftedPlayer.id ? draftedPlayer : p)));

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamToDraftTo.id) return t;
        const slots = { ...t.rosterSlots };
        if (slots[draftedPlayer.draftedSlotType]) slots[draftedPlayer.draftedSlotType].current++;
        return { ...t, roster: [...t.roster, draftedPlayer], rosterSlots: slots };
      })
    );

    setDraftHistory((prev) => [...prev, { player: draftedPlayer, team: teamToDraftTo }]);
    setCurrentPickIndex((i) => i + 1);
    setSearchTerm("");
    setShowConfirmation(false);
    setPlayerToDraft(null);
    setTeamToDraftTo(null);
  };

  const handleUndoLastPick = () => {
    if (!draftHistory.length) return;
    const last = draftHistory[draftHistory.length - 1];
    const { player, team } = last;

    setPlayers((prev) =>
      prev.map((p) =>
        p.id === player.id ? { ...p, isDrafted: false, draftedBy: undefined, draftedPickNumber: undefined, draftedSlotType: undefined } : p
      )
    );

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== team.id) return t;
        const slots = { ...t.rosterSlots };
        if (slots[player.draftedSlotType]) slots[player.draftedSlotType].current--;
        return { ...t, roster: t.roster.filter((rp) => rp.id !== player.id), rosterSlots: slots };
      })
    );

    setCurrentPickIndex((i) => Math.max(0, i - 1));
    setDraftHistory((prev) => prev.slice(0, -1));
  };

  const cancelDraftConfirmation = () => {
    setShowConfirmation(false);
    setPlayerToDraft(null);
    setTeamToDraftTo(null);
  };

  const toggleTier = (name) => setExpandedTiers((p) => ({ ...p, [name]: !p[name] }));
  const toggleSection = (name) => setExpandedSections((p) => ({ ...p, [name]: !p[name] }));

  const DraftConfirmationModal = ({ player, team, onConfirm, onCancel }) => {
    if (!player || !team) return null;
    return (
      <div className="fixed inset-0 bg-gray-600/75 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Confirm Draft Pick</h3>
          <p className="text-gray-700 mb-6">
            Draft <span className="font-semibold text-blue-600">{player.name}</span>
            <span className="text-gray-500"> ({player.position} - {player.team})</span> to{" "}
            <span className="font-semibold text-green-600">{team.name}</span>?
            <br />
            <span className="text-sm text-gray-500">This player will be placed in the <b>{player.draftedSlotType}</b> slot.</span>
          </p>
          <div className="flex justify-end gap-3">
            <button onClick={onCancel} className="px-5 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300">
              Cancel
            </button>
            <button onClick={onConfirm} className="px-5 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow">
              Draft Player
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen font-inter p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-8 mt-4 sm:mt-8 text-center drop-shadow-md">
        NFL Fantasy Draft Board
      </h1>

      {!draftStarted ? (
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-lg w-full text-center">
          <p className="text-gray-700 text-lg mb-6">
            Welcome to your live fantasy football draft! Click "Start Draft" to begin.
          </p>
          <button
            onClick={handleStartDraft}
            disabled={isLoadingPlayers}
            className={`px-8 py-3 rounded-xl text-white font-semibold shadow-lg transition
              ${isLoadingPlayers ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
          >
            {isLoadingPlayers ? "Loading Players..." : "Start Draft"}
          </button>
        </div>
      ) : (
        <div className="w-full max-w-7xl grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Left: Available Players */}
          <div className="xl:col-span-1 bg-white p-6 rounded-xl shadow-lg flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Available Players
            </h2>
            <input
              type="text"
              placeholder="Search players..."
              className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
              disabled={isLoadingPlayers}
            />
            <div ref={playerListRef} className="overflow-y-auto flex-grow pr-2 -mr-2 player-scroll">
              {isLoadingPlayers ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Loading players data...</p>
                </div>
              ) : availablePlayers.length ? (
                <div>
                  {sortedTiers.map((tier) => (
                    <div key={tier} className="mb-4 last:mb-0">
                      <button
                        className="w-full text-left py-2 px-3 bg-blue-100 rounded-lg flex justify-between items-center text-blue-800 font-semibold hover:bg-blue-200"
                        onClick={() => toggleTier(tier)}
                      >
                        {tier} ({playersByTier[tier].length} players)
                        <svg
                          className={`w-5 h-5 transition-transform ${expandedTiers[tier] ? "rotate-90" : ""}`}
                          fill="currentColor" viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </button>
                      {expandedTiers[tier] && (
                        <ul className="divide-y divide-gray-100 border border-gray-200 rounded-b-lg mt-1">
                          {playersByTier[tier].map((p) => (
                            <li key={p.id} className="py-3 px-3 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                              <div className="flex-grow mb-2 sm:mb-0">
                                <span className="font-semibold text-lg text-gray-800">{p.name}</span>
                                <span className="ml-2 text-sm text-gray-500">
                                  ({p.position} - {p.team}) ADP: {p.adp}
                                </span>
                              </div>
                              <button
                                onClick={() => handleDraftPlayer(p, currentTeam)}
                                disabled={!currentTeam}
                                className={`px-4 py-2 rounded-lg text-sm font-medium
                                  ${currentTeam ? "bg-blue-600 text-white hover:bg-blue-700 shadow" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
                              >
                                Draft
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No available players match your search.</p>
              )}
            </div>
          </div>

          {/* Right: Status + Insights + Drafted */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            {/* Draft Status */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <button
                className="w-full text-left py-2 px-3 bg-gray-100 rounded-lg flex justify-between items-center text-gray-800 font-semibold hover:bg-gray-200 mb-4"
                onClick={() => toggleSection("draftStatus")}
              >
                Draft Status
                <svg className={`w-5 h-5 transition-transform ${expandedSections.draftStatus ? "rotate-90" : ""}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
              </button>
              {expandedSections.draftStatus && (
                <div>
                  {currentPickIndex < draftOrder.length ? (
                    <div className="text-center">
                      <p className="text-xl text-gray-600 mb-2">
                        Current Pick: <span className="font-bold text-blue-600">#{currentPickIndex + 1}</span>
                      </p>
                      <p className="text-2xl font-semibold text-green-700">
                        {currentTeam ? `${currentTeam.name} is on the clock!` : "Loading..."}
                      </p>
                      <button
                        onClick={handleUndoLastPick}
                        disabled={!draftHistory.length}
                        className={`mt-4 px-6 py-2 rounded-lg text-sm font-medium
                          ${draftHistory.length ? "bg-red-500 text-white hover:bg-red-600 shadow" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
                      >
                        Undo Last Pick
                      </button>
                    </div>
                  ) : (
                    <p className="text-center text-2xl font-bold text-green-700">Draft Complete!</p>
                  )}
                  {message && <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">{message}</div>}
                </div>
              )}
            </div>

            {/* AI Insights (static text) */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <button
                className="w-full text-left py-2 px-3 bg-gray-100 rounded-lg flex justify-between items-center text-gray-800 font-semibold hover:bg-gray-200 mb-4"
                onClick={() => toggleSection("aiInsights")}
              >
                AI Insights (Conceptual)
                <svg className={`w-5 h-5 transition-transform ${expandedSections.aiInsights ? "rotate-90" : ""}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
              </button>
              {expandedSections.aiInsights && (
                <div>
                  <p className="text-gray-700 mb-3">
                    Integrating AI can significantly enhance your draft strategy, especially with tiers. Here's how:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><b>Dynamic Tier Generation:</b> analyze real-time injuries/news & scoring to update tiers.</li>
                    <li><b>Tier Drop-off Alerts:</b> warn when a tier is about to empty at a position.</li>
                    <li><b>Value Picks:</b> recommend best player based on team needs + remaining tiers.</li>
                    <li><b>Positional Scarcity:</b> quantify depth left at each position across the draft.</li>
                    <li><b>Opponent Modeling:</b> predict picks based on opponents’ rosters.</li>
                  </ul>
                  <p className="text-sm text-gray-500 mt-4">
                    *Implementing this typically requires a small backend for data + model calls.
                  </p>
                </div>
              )}
            </div>

            {/* Drafted Players */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <button
                className="w-full text-left py-2 px-3 bg-gray-100 rounded-lg flex justify-between items-center text-gray-800 font-semibold hover:bg-gray-200 mb-4"
                onClick={() => toggleSection("draftedPlayers")}
              >
                Drafted Players
                <svg className={`w-5 h-5 transition-transform ${expandedSections.draftedPlayers ? "rotate-90" : ""}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
              </button>
              {expandedSections.draftedPlayers && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Pick</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slot</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Drafted By</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {players.filter((p) => p.isDrafted).length ? (
                        players
                          .filter((p) => p.isDrafted)
                          .sort((a, b) => a.draftedPickNumber - b.draftedPickNumber)
                          .map((p) => (
                            <tr key={p.id}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{p.draftedPickNumber}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{p.position}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{p.team}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{p.draftedSlotType}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">
                                {teams.find((t) => t.id === p.draftedBy)?.name || "N/A"}
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-4 py-4 text-center text-gray-500">No players drafted yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Team Rosters */}
      {draftStarted && (
        <div className="w-full max-w-7xl bg-white p-6 rounded-xl shadow-lg mt-8">
          <button
            className="w-full text-left py-2 px-3 bg-gray-100 rounded-lg flex justify-between items-center text-gray-800 font-semibold hover:bg-gray-200 mb-4"
            onClick={() => toggleSection("teamRosters")}
          >
            Team Rosters
            <svg className={`w-5 h-5 transition-transform ${expandedSections.teamRosters ? "rotate-90" : ""}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
            </svg>
          </button>
          {expandedSections.teamRosters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {teams.map((team) => (
                <div key={team.id} className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-xl font-semibold text-blue-700 mb-3">{team.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">Owner: {team.owner}</p>
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-700 mb-1">Roster Slots:</h4>
                    <ul className="text-sm text-gray-700 grid grid-cols-2 gap-x-4">
                      {Object.entries(team.rosterSlots).map(([slot, { current, max }]) => (
                        <li key={slot}>{slot}: {current}/{max}</li>
                      ))}
                    </ul>
                  </div>
                  {team.roster.length ? (
                    <ul className="space-y-1">
                      {team.roster.map((p) => (
                        <li key={p.id} className="text-sm text-gray-800">
                          • {p.name} ({p.position} - {p.team}) - <span className="text-gray-600 italic">{p.draftedSlotType}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Roster is empty.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showConfirmation && (
        <DraftConfirmationModal player={playerToDraft} team={teamToDraftTo} onConfirm={confirmDraft} onCancel={cancelDraftConfirmation} />
      )}
    </div>
  );
};

export default App;
