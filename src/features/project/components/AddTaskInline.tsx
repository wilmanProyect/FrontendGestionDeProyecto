/**
 * AddTaskInline.tsx
 * Input expandible en el footer de una columna para crear tareas sin modal.
 * Se activa al hacer click en "+ Agregar tarea".
 */

import { useState, useRef, useEffect } from 'react';
import { Spinner } from '@/shared/components/Spinner';

interface AddTaskInlineProps {
  listId: string;
  onAdd: (title: string) => Promise<unknown>;
}

export const AddTaskInline = ({ listId, onAdd }: AddTaskInlineProps) => {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle]       = useState('');
  const [loading, setLoading]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setLoading(true);
    await onAdd(title.trim());
    setTitle('');
    setLoading(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSubmit(); }
    if (e.key === 'Escape') { setExpanded(false); setTitle(''); }
  };

  const handleBlur = () => {
    if (!title.trim()) setExpanded(false);
  };

  if (!expanded) {
    return (
      <button
        type="button"
        data-list={listId}
        onClick={() => setExpanded(true)}
        className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-surface-500 hover:text-white hover:bg-surface-800/60 border border-transparent hover:border-surface-700/40 transition-all duration-150 group"
      >
        <svg className="w-3.5 h-3.5 group-hover:text-brand-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Agregar tarea
      </button>
    );
  }

  return (
    <div className="px-1 pb-1 space-y-1.5">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Nombre de la tarea..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          disabled={loading}
          className="w-full rounded-xl border border-brand-500/40 bg-surface-800 px-3 py-2.5 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
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
          onMouseDown={(e) => { e.preventDefault(); handleSubmit(); }}
          disabled={!title.trim() || loading}
          className="flex-1 rounded-lg bg-brand-500 hover:bg-brand-400 disabled:opacity-40 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
        >
          Agregar
        </button>
        <button
          type="button"
          onClick={() => { setExpanded(false); setTitle(''); }}
          className="rounded-lg border border-surface-700/50 px-2.5 py-1.5 text-xs text-surface-400 hover:text-white hover:bg-surface-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p className="text-[10px] text-surface-600 pl-1">Enter para agregar · Esc para cancelar</p>
    </div>
  );
};
