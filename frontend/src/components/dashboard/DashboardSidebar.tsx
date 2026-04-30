export default function DashboardSidebar() {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-56 bg-surface-100 border-r border-outline hidden lg:block overflow-y-auto">
      <div className="p-4 space-y-6">
        <nav className="space-y-1">
          <a href="#" className="block px-3 py-2 rounded-lg text-sm font-medium text-primary bg-primary-dim hover:bg-surface-300 transition-colors">
            Live Feed
          </a>
          <a href="#" className="block px-3 py-2 rounded-lg text-sm font-medium text-on-surf hover:bg-surface-300 transition-colors">
            Top Extractors
          </a>
          <a href="#" className="block px-3 py-2 rounded-lg text-sm font-medium text-on-surf hover:bg-surface-300 transition-colors">
            Searchers
          </a>
          <a href="#" className="block px-3 py-2 rounded-lg text-sm font-medium text-on-surf hover:bg-surface-300 transition-colors">
            Network Health
          </a>
        </nav>

        <div>
          <h3 className="px-3 mb-2 text-xs font-semibold text-muted uppercase tracking-wider">Filters</h3>
          <div className="space-y-2">
            {['Sandwich', 'Frontrun', 'Backrun'].map((f) => (
              <label key={f} className="flex items-center px-3 py-1.5 cursor-pointer hover:bg-surface-300 rounded-lg transition-colors">
                <input type="checkbox" defaultChecked className="mr-2 w-4 h-4 accent-primary" />
                <span className="text-sm text-on-surf">{f}</span>
              </label>
            ))}
            <label className="flex items-center px-3 py-1.5 cursor-pointer hover:bg-surface-300 rounded-lg transition-colors">
              <input type="checkbox" className="mr-2 w-4 h-4 accent-primary" />
              <span className="text-sm text-on-surf">Liquidation</span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-outline">
          <a href="#" className="block px-3 py-2 rounded-lg text-sm font-medium text-on-surf hover:bg-surface-300 transition-colors">
            Settings
          </a>
          <div className="px-3 mt-4">
            <span className="text-xs font-mono text-muted">v0.9.4-beta</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
