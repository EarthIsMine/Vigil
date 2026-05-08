export default function ValidatorListLoading() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <main className="pt-14">
        <div className="px-6 py-10 max-w-6xl mx-auto">
          <div className="h-12 w-64 bg-vigil-card-dark rounded mb-3 animate-pulse" />
          <div className="h-5 w-96 bg-vigil-card-dark rounded mb-10 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 border-y border-vigil-border py-6 mb-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="h-3 w-24 bg-vigil-card-dark rounded mb-2 animate-pulse" />
                <div className="h-9 w-32 bg-vigil-card-dark rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div className="h-10 w-full sm:max-w-md bg-vigil-card-dark rounded mb-6 animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 bg-vigil-card-dark rounded animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
