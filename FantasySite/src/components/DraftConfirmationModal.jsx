import React, { useEffect, useRef } from 'react';

export default function DraftConfirmationModal({ player, team, onConfirm, onCancel }) {
  const confirmRef = useRef(null);
  const dialogId = 'draft-confirmation-title';

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter' && document.activeElement === confirmRef.current) onConfirm();
    }
    document.addEventListener('keydown', onKey);
    // focus confirm button when opened
    confirmRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [onConfirm, onCancel]);

  if (!player || !team) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50" aria-hidden={false}>
      <div role="dialog" aria-modal="true" aria-labelledby={dialogId} className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h3 id={dialogId} className="text-xl font-bold text-gray-800 mb-4">
          Confirm Draft Pick
        </h3>
        <p className="text-gray-700 mb-6">
          Draft <span className="font-semibold text-blue-600">{player.name}</span>
          <span className="text-gray-500"> ({player.position} - {player.team})</span> to <span className="font-semibold text-green-600">{team.name}</span>?
          <br />
          <span className="text-sm text-gray-500">This player will be placed in the <span className="font-medium">{player.draftedSlotType}</span> slot.</span>
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Draft Player
          </button>
        </div>
      </div>
    </div>
  );
}