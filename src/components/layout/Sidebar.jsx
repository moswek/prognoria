import { Eye, EyeSlash, ChartLine, Globe, ChartBar, Newspaper } from '@phosphor-icons/react';
import useDashboardStore from '../../store/dashboardStore';

const FINANCE_WIDGETS = [
  { key: 'marketTicker', label: 'Market Ticker' },
  { key: 'stockPredictions', label: 'Stock Signals' },
  { key: 'stockChart', label: 'Stock Chart' },
  { key: 'trendPredictor', label: 'Trend Predictor' },
  { key: 'watchlistTable', label: 'Watchlist' },
  { key: 'newsWidget', label: 'Stock News' },
  { key: 'tradeSimulator', label: 'Trade Simulator' },
];

const Sidebar = () => {
  const { sectors, widgets, toggleWidget } = useDashboardStore();

  return (
    <aside className="w-64 bg-card border-r border-white/5 flex flex-col h-full">
      <div className="p-6 border-b border-white/5">
        <h2 className="font-display text-xl font-bold text-accent tracking-tight">
          Controls
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {sectors.finance && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Finance Mode
            </h3>
            <div className="flex gap-2 mb-4">
              <button
                className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg bg-accent/20 border border-accent/40 text-accent"
              >
                <ChartBar size={16} weight="fill" />
                <span className="text-xs font-medium">Stocks</span>
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                <span className="text-xs font-medium">Crypto</span>
              </button>
            </div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Widgets
            </h3>
            <div className="space-y-2">
              {FINANCE_WIDGETS.map((widget) => (
                <button
                  key={widget.key}
                  onClick={() => toggleWidget('finance', widget.key)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all duration-200 ${
                    widgets.finance[widget.key]
                      ? 'bg-white/5 border border-white/10'
                      : 'bg-white/[0.02] border border-white/5 opacity-50'
                  }`}
                >
                  <span className="text-sm text-gray-300">{widget.label}</span>
                  {widgets.finance[widget.key] ? (
                    <Eye size={16} className="text-accent" />
                  ) : (
                    <EyeSlash size={16} className="text-gray-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5">
        <p className="text-xs text-gray-600 text-center">
          Layout saved to localStorage
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
