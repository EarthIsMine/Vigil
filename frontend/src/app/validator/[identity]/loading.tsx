export default function ValidatorIdentityLoading() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <main className="pt-14">
        <div className="px-6 py-10 max-w-6xl mx-auto">
          <div className="h-4 w-48 bg-vigil-card-dark rounded mb-6 animate-pulse" />
          <div className="h-16 w-3/4 bg-vigil-card-dark rounded mb-10 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-vigil-card-dark rounded animate-pulse" />
            ))}
          </div>
          <div className="h-72 bg-vigil-card-dark rounded mb-10 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            <div className="h-64 bg-vigil-card-dark rounded animate-pulse" />
            <div className="h-64 bg-vigil-card-dark rounded animate-pulse" />
          </div>
          <div className="h-96 bg-vigil-card-dark rounded animate-pulse" />
        </div>
      </main>
    </div>
  );
}
