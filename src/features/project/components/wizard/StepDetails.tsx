/**
 * StepDetails.tsx
 * Paso 1 del wizard: Nombre, Descripción, Etiquetas iniciales, Listas iniciales.
 */

import { useState, useId } from 'react';
import { Input } from '@/shared/components/Input';
import type { WizardFormState, WizardLabel, WizardList } from '../../types/board.types';

// ── Colores disponibles para etiquetas ──────────────────────────────────────

const LABEL_COLORS = [
  { value: '#3b82f6', label: 'Azul'     },
  { value: '#10b981', label: 'Verde'    },
  { value: '#f59e0b', label: 'Ámbar'    },
  { value: '#ef4444', label: 'Rojo'     },
  { value: '#8b5cf6', label: 'Violeta'  },
  { value: '#06b6d4', label: 'Cyan'     },
  { value: '#ec4899', label: 'Rosa'     },
  { value: '#6b7280', label: 'Gris'     },
];

const DEFAULT_LISTS = ['To Do', 'In Progress', 'Done'];

interface StepDetailsProps {
  form: WizardFormState;
  onChange: (patch: Partial<WizardFormState>) => void;
  errors: Record<string, string>;
}

let tempCounter = 0;
const genTempId = () => `tmp-${++tempCounter}`;

export const StepDetails = ({ form, onChange, errors }: StepDetailsProps) => {
  const [newLabel, setNewLabel]       = useState('');
  const [newLabelColor, setNewLabelColor] = useState(LABEL_COLORS[0].value);
  const [newListName, setNewListName] = useState('');
  const descId = useId();

  // ── Labels ──────────────────────────────────────────────────────────────

  const addLabel = () => {
    if (!newLabel.trim()) return;
    const label: WizardLabel = { tempId: genTempId(), name: newLabel.trim(), color: newLabelColor };
    onChange({ labels: [...form.labels, label] });
    setNewLabel('');
  };

  const removeLabel = (tempId: string) =>
    onChange({ labels: form.labels.filter((l) => l.tempId !== tempId) });

  // ── Lists ────────────────────────────────────────────────────────────────

  const addList = (name: string) => {
    if (!name.trim()) return;
    const list: WizardList = { tempId: genTempId(), name: name.trim() };
    onChange({ lists: [...form.lists, list] });
  };

  const removeList = (tempId: string) =>
    onChange({ lists: form.lists.filter((l) => l.tempId !== tempId) });

  const handleListKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addList(newListName);
      setNewListName('');
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Nombre ─────────────────────────────────────────────────────── */}
      <Input
        label="Nombre del proyecto"
        placeholder="Nombre del proyecto"
        value={form.name}
        onChange={(e) => onChange({ name: e.target.value })}
        error={errors.name}
        autoFocus
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Fecha inicio"
          type="date"
          value={form.startDate}
          onChange={(e) => onChange({ startDate: e.target.value })}
        />
        <Input
          label="Fecha fin"
          type="date"
          value={form.endDate}
          min={form.startDate || undefined}
          onChange={(e) => onChange({ endDate: e.target.value })}
        />
      </div>

      {/* ── Descripción ─────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <label htmlFor={descId} className="block text-sm font-medium text-surface-300">
          Descripción <span className="text-surface-500 font-normal">(opcional)</span>
        </label>
        <textarea
          id={descId}
          rows={3}
          placeholder="Descripción (opcional)"
          value={form.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className="block w-full rounded-xl border border-surface-600/40 bg-surface-900 px-4 py-3 text-sm text-white placeholder-surface-500 resize-none transition-all duration-200 hover:border-accent-500/40 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
        />
      </div>

      {/* ── Etiquetas ──────────────────────────────────────────────────────── */}
      <div className="space-y-2.5">
        <p className="text-sm font-medium text-surface-300">Etiquetas</p>

        {/* Tags existentes */}
        <div className="flex flex-wrap gap-2 min-h-[28px]">
          {form.labels.map((label) => (
            <span
              key={label.tempId}
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium text-white"
              style={{ borderColor: label.color + '60', backgroundColor: label.color + '20' }}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: label.color }} />
              {label.name}
              <button
                type="button"
                onClick={() => removeLabel(label.tempId)}
                className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
                aria-label={`Eliminar etiqueta ${label.name}`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>

        {/* Agregar etiqueta */}
        <div className="flex gap-2">
          {/* Color picker */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl border border-surface-600/40 bg-surface-900">
            {LABEL_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                title={c.label}
                onClick={() => setNewLabelColor(c.value)}
                className={[
                  'w-5 h-5 rounded-full transition-all duration-150',
                  newLabelColor === c.value
                    ? 'ring-2 ring-white ring-offset-1 ring-offset-surface-900 scale-110'
                    : 'hover:scale-110',
                ].join(' ')}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>

          <input
            type="text"
            placeholder="+ Agregar etiqueta"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLabel(); } }}
            className="flex-1 rounded-xl border border-surface-600/40 bg-surface-900 px-3 py-2 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
          />
          <button
            type="button"
            onClick={addLabel}
            disabled={!newLabel.trim()}
            className="flex items-center gap-1.5 rounded-xl border border-surface-600/40 bg-surface-800 px-3 py-2 text-xs text-surface-300 hover:text-white hover:bg-surface-700 transition-all disabled:opacity-40"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar
          </button>
        </div>
      </div>

      {/* ── Listas iniciales ────────────────────────────────────────────────── */}
      <div className="space-y-2.5">
        <p className="text-sm font-medium text-surface-300">Listas</p>

        <div className="flex flex-wrap gap-2 min-h-[28px]">
          {form.lists.map((list) => (
            <span
              key={list.tempId}
              className="inline-flex items-center gap-1.5 rounded-lg border border-surface-600/40 bg-surface-800 px-2.5 py-1 text-xs text-surface-200"
            >
              {list.name}
              <button
                type="button"
                onClick={() => removeList(list.tempId)}
                className="opacity-50 hover:opacity-100 transition-opacity"
                aria-label={`Eliminar lista ${list.name}`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>

        {/* Agregar lista */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nombre de la lista (Enter para agregar)"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            onKeyDown={handleListKeyDown}
            className="flex-1 rounded-xl border border-surface-600/40 bg-surface-900 px-3 py-2 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
          />
          <button
            type="button"
            onClick={() => { addList(newListName); setNewListName(''); }}
            disabled={!newListName.trim()}
            className="flex items-center gap-1.5 rounded-xl border border-surface-600/40 bg-surface-800 px-3 py-2 text-xs text-surface-300 hover:text-white hover:bg-surface-700 transition-all disabled:opacity-40"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar
          </button>
        </div>

        {/* Sugerencias rápidas */}
        {form.lists.length === 0 && (
          <div className="flex flex-wrap gap-1.5">
            <p className="w-full text-xs text-surface-500">Sugerencias rápidas:</p>
            {DEFAULT_LISTS.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => addList(name)}
                className="rounded-lg border border-dashed border-surface-600/50 px-2.5 py-1 text-xs text-surface-400 hover:text-white hover:border-brand-500/50 hover:bg-brand-500/5 transition-all"
              >
                + {name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
