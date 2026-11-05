'use client';

import { useActionState, useEffect, useState } from 'react';
import { submitAdoptionRequest, type AdoptionActionState } from './actions';

const initialState: AdoptionActionState = {
  status: 'idle',
  message: '',
  fieldErrors: {},
};

export default function AdoptionForm({
  dogId,
  status,
}: {
  dogId: number;
  status: 'AVAILABLE' | 'PENDING' | 'ADOPTED';
}) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [state, formAction, isPending] = useActionState(
    submitAdoptionRequest.bind(null, dogId),
    initialState,
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (status !== 'AVAILABLE' && state.status === 'idle') {
    return null;
  }

  return (
    <section className="mt-8 rounded-xl border border-slate-700 bg-slate-800/70 p-6">
      {status === 'AVAILABLE' && (
        <>
          <h2 className="mb-4 text-xl font-semibold text-slate-100">Request to Adopt</h2>
          <form
            action={formAction}
            className="max-w-xl space-y-4"
            data-testid="adoption-form"
            data-hydrated={isHydrated}
          >
            <div>
              <label htmlFor="applicant-name" className="mb-1 block text-sm font-medium text-slate-200">
                Your name
              </label>
              <input
                id="applicant-name"
                name="applicant_name"
                type="text"
                autoComplete="name"
                maxLength={100}
                required
                aria-invalid={Boolean(state.fieldErrors.applicant_name)}
                aria-describedby={state.fieldErrors.applicant_name ? 'applicant-name-error' : undefined}
                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 focus:border-blue-400 focus:outline-none"
                data-testid="adoption-name"
              />
              {state.fieldErrors.applicant_name && (
                <p id="applicant-name-error" className="mt-1 text-sm text-red-400" role="alert">
                  {state.fieldErrors.applicant_name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="applicant-email" className="mb-1 block text-sm font-medium text-slate-200">
                Your email
              </label>
              <input
                id="applicant-email"
                name="applicant_email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                aria-invalid={Boolean(state.fieldErrors.applicant_email)}
                aria-describedby={state.fieldErrors.applicant_email ? 'applicant-email-error' : undefined}
                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 focus:border-blue-400 focus:outline-none"
                data-testid="adoption-email"
              />
              {state.fieldErrors.applicant_email && (
                <p id="applicant-email-error" className="mt-1 text-sm text-red-400" role="alert">
                  {state.fieldErrors.applicant_email}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
              data-testid="adoption-submit"
            >
              Submit adoption request
            </button>
          </form>
        </>
      )}

      {state.status === 'success' && (
        <p className="mt-4 text-green-400" role="status" data-testid="adoption-success">
          {state.message}
        </p>
      )}
      {state.status === 'error' && state.message && (
        <p className="mt-4 text-red-400" role="alert" data-testid="adoption-error">
          {state.message}
        </p>
      )}
    </section>
  );
}
