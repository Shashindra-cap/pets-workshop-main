import type { Metadata } from 'next';
import DogList from '../components/DogList';

export const metadata: Metadata = {
  title: 'Tailspin Shelter - Find Your Forever Friend',
};

interface Dog {
  id: number;
  name: string;
  breed: string;
}

interface DogsResponse {
  dogs: Dog[];
  page: number;
  total_pages: number;
}

interface PageProps {
  searchParams: Promise<{ page?: string | string[] }>;
}

function parsePage(value: string | string[] | undefined) {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) {
    return 1;
  }

  const page = Number(value);
  return Number.isSafeInteger(page) ? page : 1;
}

export default async function Home({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const requestedPage = parsePage(pageParam);
  const apiUrl = (process.env.API_SERVER_URL || 'http://localhost:5100').replace(/\/+$/, '');

  let dogs: Dog[] = [];
  let page = 1;
  let totalPages = 1;
  let error: string | null = null;

  try {
    const response = await fetch(
      `${apiUrl}/api/dogs?page=${requestedPage}&per_page=6`,
      { cache: 'no-store' },
    );

    if (response.ok) {
      const data = (await response.json()) as DogsResponse;
      dogs = data.dogs;
      page = data.page;
      totalPages = data.total_pages;
    } else {
      error = `Failed to fetch data: ${response.status} ${response.statusText}`;
    }
  } catch (err) {
    error = `Error: ${err instanceof Error ? err.message : String(err)}`;
  }

  return (
    <div className="py-8">
      <div className="mb-10 max-w-3xl">
        <h1 className="mb-4 text-4xl font-bold text-slate-100">Welcome to Tailspin Shelter</h1>
        <p className="text-xl text-slate-300">
          Find your perfect companion from our wonderful selection of dogs looking for their forever homes.
        </p>
      </div>

      {error ? (
        <div
          className="rounded-xl border border-slate-700 bg-slate-800/50 py-12 text-center backdrop-blur-sm"
          data-testid="error-message"
        >
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <>
          <DogList dogs={dogs} />

          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-2" data-testid="pagination">
              {page > 1 ? (
                <a
                  href={`/?page=${page - 1}`}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-300 transition-colors hover:border-blue-500/50 hover:text-blue-400"
                  data-testid="pagination-prev"
                >
                  ← Previous
                </a>
              ) : (
                <span className="cursor-not-allowed rounded-lg border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-slate-600">
                  ← Previous
                </span>
              )}

              <span className="px-4 py-2 text-slate-300" data-testid="pagination-info">
                Page {page} of {totalPages}
              </span>

              {page < totalPages ? (
                <a
                  href={`/?page=${page + 1}`}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-300 transition-colors hover:border-blue-500/50 hover:text-blue-400"
                  data-testid="pagination-next"
                >
                  Next →
                </a>
              ) : (
                <span className="cursor-not-allowed rounded-lg border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-slate-600">
                  Next →
                </span>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
