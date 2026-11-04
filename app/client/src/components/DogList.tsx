interface Dog {
  id: number;
  name: string;
  breed: string;
}

export default function DogList({ dogs }: { dogs: Dog[] }) {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-medium text-slate-100">Available Dogs</h2>

      {dogs.length === 0 ? (
        <div
          className="rounded-xl border border-slate-700 bg-slate-800/50 py-12 text-center backdrop-blur-sm"
          data-testid="empty-state"
        >
          <p className="text-slate-300">No dogs available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="dog-list">
          {dogs.map((dog) => (
            <a
              href={`/dog/${dog.id}`}
              className="group block overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/60 shadow-lg backdrop-blur-sm transition-all duration-300 hover:translate-y-[-6px] hover:border-blue-500/50 hover:shadow-blue-500/10 hover:shadow-xl"
              data-testid="dog-card"
              key={dog.id}
            >
              <div className="relative p-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative z-10">
                  <h3
                    className="mb-2 text-xl font-semibold text-slate-100 transition-colors group-hover:text-blue-400"
                    data-testid="dog-name"
                  >
                    {dog.name}
                  </h3>
                  <p className="mb-4 text-slate-400" data-testid="dog-breed">
                    {dog.breed}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-blue-400">
                    <span>View details</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
