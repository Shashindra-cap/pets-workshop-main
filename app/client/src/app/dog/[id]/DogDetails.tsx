import AdoptionForm from './AdoptionForm';

interface Dog {
  id: number;
  name: string;
  breed: string;
  age: number;
  description: string;
  gender: string;
  status: 'AVAILABLE' | 'PENDING' | 'ADOPTED';
}

export default function DogDetails({ dog }: { dog: Dog }) {
  const statusLabel = dog.status === 'AVAILABLE'
    ? 'Available'
    : dog.status === 'PENDING'
      ? 'Pending Adoption'
      : 'Adopted';
  const statusClass = dog.status === 'AVAILABLE'
    ? 'bg-green-500/20 text-green-400'
    : dog.status === 'PENDING'
      ? 'bg-amber-500/20 text-amber-400'
      : 'bg-red-500/20 text-red-400';

  return (
    <>
      <div
        className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800/70 backdrop-blur-sm"
        data-testid="dog-details"
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <h1 className="mb-2 text-3xl font-bold text-slate-100" data-testid="dog-name">
              {dog.name}
            </h1>
            <span className={`rounded-full px-3 py-1 text-sm ${statusClass}`} data-testid="dog-status">
              {statusLabel}
            </span>
          </div>

          <div className="mb-6 mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <p className="text-slate-300" data-testid="dog-breed">Breed: {dog.breed}</p>
            </div>
            <div className="flex items-center">
              <p className="text-slate-300" data-testid="dog-age">
                Age: {dog.age} {dog.age === 1 ? 'year' : 'years'}
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-slate-300" data-testid="dog-gender">Gender: {dog.gender}</p>
            </div>
          </div>

          <h2 className="mb-2 text-lg font-semibold text-slate-200">About {dog.name}</h2>
          <p className="text-slate-400" data-testid="dog-description">{dog.description}</p>
        </div>
      </div>

      <AdoptionForm dogId={dog.id} status={dog.status} />
    </>
  );
}
