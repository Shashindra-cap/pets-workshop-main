'use server';

import { revalidatePath } from 'next/cache';

export interface AdoptionActionState {
  status: 'idle' | 'success' | 'error';
  message: string;
  fieldErrors: {
    applicant_name?: string;
    applicant_email?: string;
  };
}

function getApiError(payload: unknown): { message: string; field?: string } {
  if (typeof payload !== 'object' || payload === null) {
    return { message: 'The shelter returned an invalid response.' };
  }

  const record = payload as Record<string, unknown>;
  return {
    message: typeof record.error === 'string'
      ? record.error
      : 'The adoption request could not be submitted.',
    field: typeof record.field === 'string' ? record.field : undefined,
  };
}

export async function submitAdoptionRequest(
  dogId: number,
  _previousState: AdoptionActionState,
  formData: FormData,
): Promise<AdoptionActionState> {
  const applicantName = formData.get('applicant_name');
  const applicantEmail = formData.get('applicant_email');

  if (typeof applicantName !== 'string') {
    return {
      status: 'error',
      message: '',
      fieldErrors: { applicant_name: 'Enter a name between 2 and 100 characters.' },
    };
  }

  if (typeof applicantEmail !== 'string') {
    return {
      status: 'error',
      message: '',
      fieldErrors: { applicant_email: 'Enter a valid email address.' },
    };
  }

  const fieldErrors: AdoptionActionState['fieldErrors'] = {};
  const normalizedName = applicantName.trim();
  const normalizedEmail = applicantEmail.trim();
  if (normalizedName.length < 2 || normalizedName.length > 100) {
    fieldErrors.applicant_name = 'Enter a name between 2 and 100 characters.';
  }
  if (
    normalizedEmail.length > 254
    || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalizedEmail)
  ) {
    fieldErrors.applicant_email = 'Enter a valid email address.';
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', message: '', fieldErrors };
  }

  if (!Number.isSafeInteger(dogId) || dogId < 1) {
    return {
      status: 'error',
      message: 'Dog not found.',
      fieldErrors: {},
    };
  }

  const apiUrl = (process.env.API_SERVER_URL || 'http://localhost:5100').replace(/\/+$/, '');
  let response: Response;

  try {
    response = await fetch(`${apiUrl}/api/dogs/${dogId}/adoption-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicant_name: normalizedName,
        applicant_email: normalizedEmail,
      }),
      cache: 'no-store',
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return {
      status: 'error',
      message: `Unable to submit your adoption request: ${detail}`,
      fieldErrors: {},
    };
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    return {
      status: 'error',
      message: 'The shelter returned an invalid response. Please try again.',
      fieldErrors: {},
    };
  }

  if (!response.ok) {
    const apiError = getApiError(payload);
    if (response.status === 409) {
      revalidatePath(`/dog/${dogId}`);
    }

    if (apiError.field === 'applicant_name' || apiError.field === 'applicant_email') {
      return {
        status: 'error',
        message: '',
        fieldErrors: { [apiError.field]: apiError.message },
      };
    }

    return { status: 'error', message: apiError.message, fieldErrors: {} };
  }

  revalidatePath(`/dog/${dogId}`);
  return {
    status: 'success',
    message: 'Your adoption request has been submitted.',
    fieldErrors: {},
  };
}
