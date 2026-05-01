/**
 * CreateProjectWizard.tsx
 * Modal wizard de 2 pasos para crear un proyecto:
 *   Paso 1 — Detalles (nombre, descripción, etiquetas, listas)
 *   Paso 2 — Usuarios (buscar, asignar rol, ver permisos)
 *
 * Al completar navega a /projects/:id/board automáticamente.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import { StepDetails } from './StepDetails';
import { StepUsers } from './StepUsers';
import { useCreateProject } from '../../hooks/useCreateProject';
import type { WizardFormState } from '../../types/board.types';

interface CreateProjectWizardProps {
  open: boolean;
  onClose: () => void;
}

const STEPS = [
  { id: 1, label: 'Detalles'  },
  { id: 2, label: 'Usuarios'  },
];

const INITIAL_FORM: WizardFormState = {
  name:        '',
  description: '',
  startDate:   '',
  endDate:     '',
  labels:      [],
  lists:       [],
  members:     [],
};

// ── Stepper ──────────────────────────────────────────────────────────────────

const Stepper = ({ current }: { current: number }) => (
  <div className="flex items-center justify-center gap-0 mb-6">
    {STEPS.map((step, idx) => {
      const done    = current > step.id;
      const active  = current === step.id;
      return (
        <div key={step.id} className="flex items-center">
          {/* Círculo */}
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={[
                'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                done
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                  : active
                  ? 'bg-surface-800 border-2 border-brand-500 text-brand-400'
                  : 'bg-surface-800 border-2 border-surface-700 text-surface-500',
              ].join(' ')}
            >
              {done ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.id
              )}
            </div>
            <span
              className={`text-xs font-medium transition-colors ${
                active ? 'text-white' : done ? 'text-brand-400' : 'text-surface-500'
              }`}
            >
              {step.label}
            </span>
          </div>

          {/* Línea conectora */}
          {idx < STEPS.length - 1 && (
            <div
              className={[
                'w-24 h-0.5 mb-5 mx-2 transition-all duration-500',
                done ? 'bg-brand-500' : 'bg-surface-700',
              ].join(' ')}
            />
          )}
        </div>
      );
    })}
  </div>
);

// ── Wizard ───────────────────────────────────────────────────────────────────

export const CreateProjectWizard = ({ open, onClose }: CreateProjectWizardProps) => {
  const navigate   = useNavigate();
  const [step, setStep]   = useState(1);
  const [form, setForm]   = useState<WizardFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { submitWizard, isLoading, error: apiError } = useCreateProject();

  const patchForm = (patch: Partial<WizardFormState>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  // ── Validación paso 1 ───────────────────────────────────────────────────

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'El nombre es obligatorio';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Navegación ──────────────────────────────────────────────────────────

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleClose = () => {
    setStep(1);
    setForm(INITIAL_FORM);
    setErrors({});
    onClose();
  };

  // ── Submit final ────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    const projectId = await submitWizard(form);
    if (projectId) {
      handleClose();
      navigate(`/projects/${projectId}/board`);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="xl"
      closeOnBackdrop={false}
      title={
        <div className="w-full">
          <Stepper current={step} />
        </div>
      }
    >
      {/* ── Contenido del paso ──────────────────────────────────────── */}
      <div className="min-h-[320px]">
        {step === 1 && (
          <StepDetails form={form} onChange={patchForm} errors={errors} />
        )}
        {step === 2 && (
          <StepUsers form={form} onChange={patchForm} />
        )}
      </div>

      {/* ── Error de API ────────────────────────────────────────────── */}
      {apiError && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {apiError}
        </div>
      )}

      {/* ── Footer: navegación ──────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-5 mt-5 border-t border-surface-700/30">
        {/* Botón Anterior */}
        {step > 1 ? (
          <Button variant="secondary" onClick={handleBack} disabled={isLoading}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            }
          >
            Anterior
          </Button>
        ) : (
          <div />
        )}

        {/* Botón Siguiente / Crear */}
        {step < STEPS.length ? (
          <Button
            onClick={handleNext}
            rightIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            }
          >
            Siguiente
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            loading={isLoading}
            rightIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            }
          >
            Crear proyecto
          </Button>
        )}
      </div>
    </Modal>
  );
};
