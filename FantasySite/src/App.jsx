import React, { useState, useEffect, useRef } from 'react';
// REPLACED large inline mock data with imports
import playersData from './data/players';
import teamsData from './data/teams';
import { determineSlotForPlayer, allocateRosterSlot } from './utils/draftUtils';

const App = () => {
  const [players, setPlayers] = useState([]);
  // replaced initialTeams usage with imported teamsData
  const [teams, setTeams] = useState(teamsData);
  const [draftOrder, setDraftOrder] = useState([]);
  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [draftStarted, setDraftStarted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [playerToDraft, setPlayerToDraft] = useState(null);
  const [teamToDraftTo, setTeamToDraftTo] = useState(null);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(false);
  const [draftHistory, setDraftHistory] = useState([]);
  const [expandedTiers, setExpandedTiers] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    draftStatus: true,
    draftedPlayers: true,
    teamRosters: true,
  });
  const [message, setMessage] = useState('');
  const messageTimeoutRef = useRef(null);
  const playerListRef = useRef(null);
  const [showSkipConfirmation, setShowSkipConfirmation] = useState(false);

  useEffect(() => {
    // load players from external file
    setPlayers(playersData);
  }, []);

  useEffect(() => {
    const generateDraftOrder = () => {
      const order = [];
      const numTeams = teams.length;
      const numRounds = 15;

      for (let round = 0; round < numRounds; round++) {
        if (round % 2 === 0) {
          for (let i = 0; i < numTeams; i++) {
            order.push(teams[i].id);
          }
        } else {
          for (let i = numTeams - 1; i >= 0; i--) {
            order.push(teams[i].id);
          }
        }
      }
      setDraftOrder(order);
    };

    if (!isLoadingPlayers) {
      generateDraftOrder();
    }
  }, [teams, isLoadingPlayers]);

  const POSITION_TO_SLOT = {
    QB: 'QB',
    RB: 'RB',
    WR: 'WR',
    TE: 'TE',
    DP: 'DP',
    DST: 'D/ST',
    'D/ST': 'D/ST',
    K: 'K',
  };

  const slotKeyForPlayer = (player) => {
    if (!player || !player.position) return 'Bench';
    const pos = player.position.toUpperCase();
    if (['RB', 'WR', 'TE', 'QB', 'DP', 'K'].includes(pos)) return POSITION_TO_SLOT[pos] || pos;
    if (pos === 'DST') return 'D/ST';
    // default to Bench for unknown positions
    return 'Bench';
  };

  // guard for draftOrder possibly empty
  const currentTeamId = draftOrder.length > 0 ? draftOrder[currentPickIndex] : null;
  const currentTeam = currentTeamId ? teams.find(team => team.id === currentTeamId) : null;

  const showTemporaryMessage = (msg) => {
    setMessage(msg);
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    messageTimeoutRef.current = setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const availablePlayers = players.filter(player =>
    !player.isDrafted &&
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const playersByTier = availablePlayers.reduce((acc, player) => {
    const tierName = player.tier || 'Uncategorized';
    if (!acc[tierName]) {
      acc[tierName] = [];
    }
    acc[tierName].push(player);
    return acc;
  }, {});

  const sortedTiers = Object.keys(playersByTier).sort((a, b) => {
    const tierNumA = parseInt(a.match(/Tier (\d+)/)?.[1]) || Infinity;
    const tierNumB = parseInt(b.match(/Tier (\d+)/)?.[1]) || Infinity;
    if (tierNumA !== tierNumB) {
      return tierNumA - tierNumB;
    }
    return a.localeCompare(b);
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (playerListRef.current) {
      playerListRef.current.scrollTop = 0;
    }
  };

  const handleStartDraft = () => {
    setDraftStarted(true);
    setPlayers(prevPlayers => [...prevPlayers].sort((a, b) => a.adp - b.adp));
    const initialExpandedTiersState = sortedTiers.reduce((acc, tier) => {
        acc[tier] = true;
        return acc;
    }, {});
    setExpandedTiers(initialExpandedTiersState);
  };

  // simplified handleDraftPlayer using draft utils
  const handleDraftPlayer = (player, team) => {
    if (!team) {
      showTemporaryMessage('No team is currently on the clock.');
      return;
    }

    const slotType = determineSlotForPlayer(team, player);
    if (!slotType) {
      showTemporaryMessage(`${team.name} has no available slots for ${player.name}.`);
      return;
    }

    setPlayerToDraft({ ...player, draftedSlotType: slotType });
    setTeamToDraftTo(team);
    setShowConfirmation(true);
  };

  const handleSkipPick = (team) => {
    setShowSkipConfirmation(true);
    setTeamToDraftTo(team);
  };

  const confirmSkip = () => {
    if (!teamToDraftTo) return;

    const skippedPickPlayer = {
      id: `skipped-pick-${currentPickIndex + 1}`,
      name: 'N/A',
      position: 'N/A',
      team: 'N/A',
      adp: null,
      tier: 'N/A',
      isDrafted: true,
      draftedBy: teamToDraftTo.id,
      draftedPickNumber: currentPickIndex + 1,
      draftedSlotType: 'N/A',
    };

    setPlayers(prevPlayers => [...prevPlayers, skippedPickPlayer]);
    setTeams(prevTeams =>
      prevTeams.map(t => {
        if (t.id === teamToDraftTo.id) {
          const updatedRosterSlots = { ...t.rosterSlots };
          return { ...t, roster: [...t.roster, skippedPickPlayer], rosterSlots: updatedRosterSlots };
        }
        return t;
      })
    );

    setDraftHistory(prevHistory => [...prevHistory, { player: skippedPickPlayer, team: teamToDraftTo }]);
    setCurrentPickIndex(prevIndex => prevIndex + 1);
    setShowSkipConfirmation(false);
    setTeamToDraftTo(null);
  };

  // confirmDraft uses allocateRosterSlot to update slot counts
  const confirmDraft = () => {
    if (!playerToDraft || !teamToDraftTo) return;

    const draftedPlayerWithPick = {
      ...playerToDraft,
      isDrafted: true,
      draftedBy: teamToDraftTo.id,
      draftedPickNumber: currentPickIndex + 1
    };

    setPlayers(prevPlayers =>
      prevPlayers.map(p =>
        p.id === draftedPlayerWithPick.id ? draftedPlayerWithPick : p
      )
    );

    setTeams(prevTeams =>
      prevTeams.map(t => {
        if (t.id === teamToDraftTo.id) {
          // try to allocate to the chosen slot; fallback to Bench if unexpected
          const updatedRosterSlots = allocateRosterSlot(t.rosterSlots, draftedPlayerWithPick.draftedSlotType)
            || allocateRosterSlot(t.rosterSlots, 'Bench')
            || t.rosterSlots;
          return { ...t, roster: [...t.roster, draftedPlayerWithPick], rosterSlots: updatedRosterSlots };
        }
        return t;
      })
    );

    setDraftHistory(prevHistory => [...prevHistory, { player: draftedPlayerWithPick, team: teamToDraftTo }]);
    setCurrentPickIndex(prevIndex => prevIndex + 1);
    setSearchTerm('');
    setShowConfirmation(false);
    setPlayerToDraft(null);
    setTeamToDraftTo(null);
  };

  const handleUndoLastPick = () => {
    if (draftHistory.length === 0) return;

    const lastPick = draftHistory[draftHistory.length - 1];
    const { player: lastDraftedPlayer, team: draftingTeam } = lastPick;

    const updatedPlayers = lastDraftedPlayer.name === 'N/A'
      ? players.filter(p => p.id !== lastDraftedPlayer.id)
      : players.map(p =>
        p.id === lastDraftedPlayer.id ? { ...p, isDrafted: false, draftedBy: undefined, draftedPickNumber: undefined, draftedSlotType: undefined } : p
      );
    setPlayers(updatedPlayers);

    setTeams(prevTeams =>
      prevTeams.map(t => {
        if (t.id === draftingTeam.id) {
          const updatedRosterSlots = { ...t.rosterSlots };
          if (updatedRosterSlots[lastDraftedPlayer.draftedSlotType] && lastDraftedPlayer.draftedSlotType !== 'N/A') {
            updatedRosterSlots[lastDraftedPlayer.draftedSlotType].current--;
          }
          return { ...t, roster: t.roster.filter(p => p.id !== lastDraftedPlayer.id), rosterSlots: updatedRosterSlots };
        }
        return t;
      })
    );

    setCurrentPickIndex(prevIndex => Math.max(0, prevIndex - 1));
    setDraftHistory(prevHistory => prevHistory.slice(0, prevHistory.length - 1));
  };

  const cancelDraftConfirmation = () => {
    setShowConfirmation(false);
    setPlayerToDraft(null);
    setTeamToDraftTo(null);
  };

  const cancelSkipConfirmation = () => {
    setShowSkipConfirmation(false);
    setTeamToDraftTo(null);
  };

  const toggleTier = (tierName) => {
    setExpandedTiers(prev => ({
      ...prev,
      [tierName]: !prev[tierName]
    }));
  };

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };
  
  const DraftConfirmationModal = ({ player, team, onConfirm, onCancel }) => {
    if (!player || !team) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full transform transition-all duration-300 scale-100 opacity-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Draft Pick</h3>
          <p className="text-gray-700 mb-6">
            Are you sure you want to draft <span className="font-semibold text-blue-600">{player.name}</span>
            <span className="text-gray-500"> ({player.position} - {player.team})</span> to <span className="font-semibold text-green-600">{team.name}</span>?
            <br />
            <span className="text-sm text-gray-500">This player will be placed in the **{player.draftedSlotType}** slot.</span>
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-5 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out shadow-md hover:shadow-lg"
            >
              Draft Player
            </button>
          </div>
        </div>
      </div>
    );
  };

  const SkipConfirmationModal = ({ team, onConfirm, onCancel }) => {
    if (!team) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full transform transition-all duration-300 scale-100 opacity-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Skip Pick</h3>
          <p className="text-gray-700 mb-6">
            Are you sure you want to skip this pick for <span className="font-semibold text-green-600">{team.name}</span>?
            The pick will be filled with a placeholder and the draft will proceed.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-5 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 ease-in-out shadow-md hover:shadow-lg"
            >
              Skip Pick
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter text-gray-900 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-8 mt-4 sm:mt-8 text-center drop-shadow-md">
        GangGreen Draft
      </h1>

      {!draftStarted ? (
        <div className="bg-white p-8 rounded-lg shadow-xl w-full text-center">
          <p className="text-gray-700 text-lg mb-6">
            Welcome to your live fantasy football draft! Click "Start Draft" to begin.
          </p>
          <button
            onClick={handleStartDraft}
            disabled={isLoadingPlayers}
            className={`px-8 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-300 ease-in-out
              ${isLoadingPlayers
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-400'
              }`}
          >
            {isLoadingPlayers ? 'Loading Players...' : 'Start Draft'}
          </button>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel: Available Players */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Available Players</h2>
            <input
              type="text"
              placeholder="Search players..."
              className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition duration-200 ease-in-out"
              value={searchTerm}
              onChange={handleSearchChange}
              disabled={isLoadingPlayers}
            />
            <div className="overflow-y-auto flex-grow pr-2 -mr-2" style={{ maxHeight: '70vh' }} ref={playerListRef}>
              {isLoadingPlayers ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Loading players data...</p>
                </div>
              ) : availablePlayers.length > 0 ? (
                <div>
                  {sortedTiers.map(tierName => (
                    <div key={tierName} className="mb-4 last:mb-0">
                      <button
                        className="w-full text-left py-2 px-3 bg-blue-100 rounded-lg flex justify-between items-center text-blue-800 font-semibold hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out"
                        onClick={() => toggleTier(tierName)}
                      >
                        {tierName} ({playersByTier[tierName].length} players)
                        <svg
                          className={`w-5 h-5 transition-transform duration-200 ${expandedTiers[tierName] ? 'rotate-90' : ''}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                      {expandedTiers[tierName] && (
                        <ul className="divide-y divide-gray-100 border border-gray-200 rounded-b-lg mt-1">
                          {playersByTier[tierName].map(player => (
                            <li key={player.id} className="py-3 px-3 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                              <div className="flex-grow mb-2 sm:mb-0">
                                <span className="font-semibold text-lg text-gray-800">{player.name}</span>
                                <span className="ml-2 text-sm text-gray-500">
                                  ({player.position} - {player.team}) ADP: {player.adp}
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleDraftPlayer(player, currentTeam)}
                                  disabled={!currentTeam}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ease-in-out
                                    ${currentTeam
                                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                    }`}
                                >
                                  Draft
                                </button>
                              </div>
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

          {/* Middle Panel: Draft Board & Current Pick */}
          <div className="lg:col-span-2 flex flex-col space-y-8">
            {/* Draft Status Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <button
                className="w-full text-left py-2 px-3 bg-gray-100 rounded-lg flex justify-between items-center text-gray-800 font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200 ease-in-out mb-4"
                onClick={() => toggleSection('draftStatus')}
              >
                Draft Status
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${expandedSections.draftStatus ? 'rotate-90' : ''}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              {expandedSections.draftStatus && (
                <div className="transition-all duration-300 ease-in-out overflow-hidden">
                  {currentPickIndex < draftOrder.length ? (
                    <div className="text-center">
                      <p className="text-xl text-gray-600 mb-2">
                        Current Pick: <span className="font-bold text-blue-600">#{currentPickIndex + 1}</span>
                      </p>
                      <p className="text-2xl font-semibold text-green-700">
                        {currentTeam ? `${currentTeam.name} is on the clock!` : 'Loading...'}
                      </p>
                      <div className="mt-4 flex justify-center space-x-3">
                        <button
                          onClick={handleUndoLastPick}
                          disabled={draftHistory.length === 0}
                          className={`px-6 py-2 rounded-lg text-sm font-medium transition duration-200 ease-in-out
                            ${draftHistory.length > 0
                              ? 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg'
                              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            }`}
                        >
                          Undo Last Pick
                        </button>
                        <button
                          onClick={() => handleSkipPick(currentTeam)}
                          disabled={!currentTeam}
                          className={`px-6 py-2 rounded-lg text-sm font-medium transition duration-200 ease-in-out
                            ${currentTeam
                              ? 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-md hover:shadow-lg'
                              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            }`}
                        >
                          Skip Pick
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-2xl font-bold text-green-700">Draft Complete!</p>
                  )}
                  {message && (
                    <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">
                      {message}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Drafted Players / Draft Board Overview */}
            <div className="bg-white p-6 rounded-lg shadow-lg flex-grow">
              <button
                className="w-full text-left py-2 px-3 bg-gray-100 rounded-lg flex justify-between items-center text-gray-800 font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200 ease-in-out mb-4"
                onClick={() => toggleSection('draftedPlayers')}
              >
                Drafted Players
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${expandedSections.draftedPlayers ? 'rotate-90' : ''}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              {expandedSections.draftedPlayers && (
                <div className="transition-all duration-300 ease-in-out overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                            Pick
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Player
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Position
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Team
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Slot
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                            Drafted By
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {players.filter(player => player.isDrafted).length > 0 ? (
                          players
                            .filter(player => player.isDrafted)
                            .sort((a, b) => a.draftedPickNumber - b.draftedPickNumber)
                            .map(player => (
                              <tr key={player.id}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                  {player.draftedPickNumber}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {player.name}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                  {player.position}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                  {player.team}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                  {player.draftedSlotType}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">
                                  {teams.find(t => t.id === player.draftedBy)?.name || 'N/A'}
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
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Team Rosters Section (below the main draft board for better flow on smaller screens) */}
      {draftStarted && (
        <div className="w-full mt-8">
          <button
            className="w-full text-left py-2 px-3 bg-white rounded-lg shadow-lg flex justify-between items-center text-gray-800 font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200 ease-in-out mb-4"
            onClick={() => toggleSection('teamRosters')}
          >
            Team Rosters
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${expandedSections.teamRosters ? 'rotate-90' : ''}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          {expandedSections.teamRosters && (
            <div className="transition-all duration-300 ease-in-out overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {teams.map(team => (
                  <div key={team.id} className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-xl font-semibold text-blue-700 mb-3">{team.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">Owner: {team.owner}</p>
                    <div className="mb-3">
                      <h4 className="font-semibold text-gray-700 mb-1">Roster Slots:</h4>
                      <ul className="text-sm text-gray-700 grid grid-cols-2 gap-x-4">
                        {Object.entries(team.rosterSlots).map(([slot, { current, max }]) => (
                          <li key={slot}>
                            {slot}: {current}/{max}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {team.roster.length > 0 ? (
                      <ul className="space-y-1">
                        {team.roster.map(player => (
                          <li key={player.id} className="text-sm text-gray-800">
                            • {player.name} ({player.position} - {player.team}) - <span className="text-gray-600 italic">{player.draftedSlotType}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Roster is empty.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showConfirmation && (
        <DraftConfirmationModal
          player={playerToDraft}
          team={teamToDraftTo}
          onConfirm={confirmDraft}
          onCancel={cancelDraftConfirmation}
        />
      )}
      {showSkipConfirmation && (
        <SkipConfirmationModal
          team={teamToDraftTo}
          onConfirm={confirmSkip}
          onCancel={cancelSkipConfirmation}
        />
      )}
    </div>
  );
};

export default App;
