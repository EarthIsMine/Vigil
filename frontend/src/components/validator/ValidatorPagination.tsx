export default function ValidatorPagination() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="text-sm text-[#8892ab]">Showing 1–8 of 4,745 attacks</div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded transition-colors disabled:opacity-50" disabled>Previous</button>
        {[1, 2, 3].map((n) => (
          <button key={n} className={`px-3 py-1 rounded transition-colors ${n === 1 ? 'bg-[#3b82f6]' : 'bg-white/5 hover:bg-white/10'}`}>{n}</button>
        ))}
        <span className="px-3 py-1 text-[#8892ab]">...</span>
        <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded transition-colors">593</button>
        <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded transition-colors">Next</button>
      </div>
    </div>
  );
}
