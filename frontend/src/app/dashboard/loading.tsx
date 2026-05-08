export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-surface text-white">
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
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 mb-14">
            <div className="h-72 bg-vigil-card-dark rounded animate-pulse" />
            <div className="h-72 bg-vigil-card-dark rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="h-72 bg-vigil-card-dark rounded animate-pulse" />
            <div className="h-72 bg-vigil-card-dark rounded animate-pulse" />
          </div>
        </div>
      </main>
    </div>
  );
}
