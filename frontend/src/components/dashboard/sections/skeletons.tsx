export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 border-y border-vigil-border py-6 mb-10">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}>
          <div className="h-3 w-24 bg-vigil-card-dark rounded mb-2 animate-pulse" />
          <div className="h-9 w-32 bg-vigil-card-dark rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return <div className="h-72 bg-vigil-card-dark rounded animate-pulse" />;
}

export function LeaderboardSkeleton() {
  return <div className="h-72 bg-vigil-card-dark rounded animate-pulse" />;
}

export function LiveFeedSkeleton() {
  return <div className="h-72 bg-vigil-card-dark rounded animate-pulse" />;
}
