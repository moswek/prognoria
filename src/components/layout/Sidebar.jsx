import { Eye, EyeSlash, ChartLine, Trophy, Newspaper, Globe, ChartBar } from '@phosphor-icons/react';
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

const SPORTS_WIDGETS = [
  { key: 'matchPredictor', label: 'Predictions' },
  { key: 'formTable', label: 'League Table' },
  { key: 'liveScores', label: 'Results' },
];

const Sidebar = () => {
  const { sectors, widgets, toggleSector, toggleWidget } = useDashboardStore();

  return (
    <aside className="w-64 bg-card border-r border-white/5 flex flex-col h-full">
      <div className="p-6 border-b border-white/5">
        <h2 className="font-display text-xl font-bold text-accent tracking-tight">
          Controls
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Sectors
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => toggleSector('finance')}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                sectors.finance
                  ? 'bg-accent/10 border border-accent/30'
                  : 'bg-white/5 border border-white/5 hover:bg-white/10'
              }`}
            >
              <span className="flex items-center gap-3">
                <ChartLine 
                  size={20} 
                  weight="fill" 
                  className={sectors.finance ? 'text-accent' : 'text-gray-500'} 
                />
                <span className="font-medium text-sm">Finance</span>
              </span>
              <div className={`w-8 h-4 rounded-full relative transition-colors ${
                sectors.finance ? 'bg-accent' : 'bg-gray-600'
              }`}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                  sectors.finance ? 'left-4' : 'left-0.5'
                }`} />
              </div>
            </button>

            <button
              onClick={() => toggleSector('sports')}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                sectors.sports
                  ? 'bg-accent/10 border border-accent/30'
                  : 'bg-white/5 border border-white/5 hover:bg-white/10'
              }`}
            >
              <span className="flex items-center gap-3">
                <Trophy 
                  size={20} 
                  weight="fill" 
                  className={sectors.sports ? 'text-accent' : 'text-gray-500'} 
                />
                <span className="font-medium text-sm">Sports</span>
              </span>
              <div className={`w-8 h-4 rounded-full relative transition-colors ${
                sectors.sports ? 'bg-accent' : 'bg-gray-600'
              }`}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                  sectors.sports ? 'left-4' : 'left-0.5'
                }`} />
              </div>
            </button>
          </div>
        </div>

        {sectors.finance && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Finance Widgets
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

        {sectors.sports && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Sports Widgets
            </h3>
            <div className="space-y-2">
              {SPORTS_WIDGETS.map((widget) => (
                <button
                  key={widget.key}
                  onClick={() => toggleWidget('sports', widget.key)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all duration-200 ${
                    widgets.sports[widget.key]
                      ? 'bg-white/5 border border-white/10'
                      : 'bg-white/[0.02] border border-white/5 opacity-50'
                  }`}
                >
                  <span className="text-sm text-gray-300">{widget.label}</span>
                  {widgets.sports[widget.key] ? (
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
