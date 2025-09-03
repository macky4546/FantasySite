import React, { useEffect, useRef } from 'react';

export default function SkipConfirmationModal({ team, onConfirm, onCancel }) {
  const confirmRef = useRef(null);
  const titleId = 'skip-confirmation-title';

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter' && document.activeElement === confirmRef.current) onConfirm();
    }
    document.addEventListener('keydown', onKey);
    confirmRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [onConfirm, onCancel]);

  if (!team) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 id={titleId} className="text-lg font-semibold text-gray-800 mb-3">Confirm Skip Pick</h3>
        <p className="text-sm text-gray-700 mb-4">
          Are you sure you want to skip the current pick for <span className="font-medium text-green-700">{team.name}</span>?
        </p>
        <div className="flex justify-end space-x-3">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</button>
          <button ref={confirmRef} onClick={onConfirm} className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600">Skip Pick</button>
        </div>
      </div>
    </div>
  );
}