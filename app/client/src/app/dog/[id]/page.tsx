import type { Metadata } from 'next';
import DogDetails from './DogDetails';

export const metadata: Metadata = {
  title: 'Dog Details - Tailspin Shelter',
};

interface Dog {
  id: number;
  name: string;
  breed: string;
  age: number;
  description: string;
  gender: string;
  status: 'AVAILABLE' | 'PENDING' | 'ADOPTED';
}

export default async function DogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsedId = /^[1-9]\d*$/.test(id) ? Number(id) : Number.NaN;
  const dogId = Number.isSafeInteger(parsedId) ? parsedId : null;
  const apiUrl = (process.env.API_SERVER_URL || 'http://localhost:5100').replace(/\/+$/, '');

  let dog: Dog | null = null;
  let error: string | null = null;

  if (dogId === null) {
    error = 'Dog not found';
  } else {
    try {
      const response = await fetch(`${apiUrl}/api/dogs/${dogId}`, { cache: 'no-store' });
      if (response.ok) {
        dog = (await response.json()) as Dog;
      } else if (response.status === 404) {
        error = 'Dog not found';
      } else {
        error = `Failed to fetch dog: ${response.status} ${response.statusText}`;
      }
    } catch (err) {
      error = `Error: ${err instanceof Error ? err.message : String(err)}`;
    }
  }

  return (
    <div className="py-8">
      {error ? (
        <div
          className="rounded-xl border border-red-500/50 bg-red-500/20 p-6 text-red-400"
          data-testid="error-message"
        >
          {error}
        </div>
      ) : dog ? (
        <DogDetails dog={dog} />
      ) : (
        <div className="rounded-xl bg-slate-800/60 p-6 backdrop-blur-sm">
          <p className="text-slate-400">No dog information available</p>
        </div>
      )}

      <div className="mt-8">
        <a
          href="/"
          data-testid="back-link"
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-all duration-300 hover:bg-blue-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 01-1.414 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to All Dogs
        </a>
      </div>
    </div>
  );
}
