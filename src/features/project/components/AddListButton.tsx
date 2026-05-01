/**
 * AddListButton.tsx
 * Botón "+ Agregar lista" siempre visible al final del scroll horizontal.
 * Expande a un input inline al hacer click.
 */

import { useState, useRef, useEffect } from 'react';
import { Spinner } from '@/shared/components/Spinner';

interface AddListButtonProps {
  onAdd: (name: string) => Promise<unknown>;
}

export const AddListButton = ({ onAdd }: AddListButtonProps) => {
  const [expanded, setExpanded] = useState(false);
  const [name, setName]         = useState('');
  const [loading, setLoading]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await onAdd(name.trim());
    setName('');
    setLoading(false);
    setExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSubmit(); }
    if (e.key === 'Escape') { setExpanded(false); setName(''); }
  };

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-surface-700/50 bg-surface-900/30 hover:border-brand-500/50 hover:bg-surface-800/40 px-4 py-3 text-sm text-surface-500 hover:text-white transition-all duration-200 min-w-[200px] shrink-0 h-fit"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Agregar lista
      </button>
    );
  }

  return (
    <div className="min-w-[240px] shrink-0 rounded-2xl border border-brand-500/30 bg-surface-900/60 p-3 space-y-2 h-fit">
      <p className="text-xs font-semibold text-surface-300 mb-2">Nueva lista</p>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Nombre de la lista..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="w-full rounded-xl border border-surface-600/40 bg-surface-800 px-3 py-2.5 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Spinner size="xs" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!name.trim() || loading}
          className="flex-1 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 px-3 py-2 text-xs font-semibold text-white transition-colors"
        >
          Crear lista
        </button>
        <button
          type="button"
          onClick={() => { setExpanded(false); setName(''); }}
          className="rounded-xl border border-surface-700/50 px-2.5 py-2 text-surface-400 hover:text-white hover:bg-surface-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
