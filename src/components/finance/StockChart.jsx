import { useState } from 'react';
import { MagnifyingGlass, ArrowRight } from '@phosphor-icons/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import useDashboardStore from '../../store/dashboardStore';
import { useStockData, useSymbolSearch } from '../../hooks/useStockData';
import { formatPrice, formatPercentage } from '../../utils/predictions';

const StockChart = () => {
  const { selectedTicker, setSelectedTicker } = useDashboardStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { quote, timeSeries, loading } = useStockData(selectedTicker);
  const { results: searchResults, loading: searchLoading } = useSymbolSearch(searchQuery);

  const handleSearch = (symbol) => {
    setSelectedTicker(symbol);
    setSearchQuery('');
    setShowSearch(false);
  };

  const displayData = timeSeries.slice(-30).map((item) => ({
    ...item,
    formattedDate: format(parseISO(item.date), 'MMM dd'),
  }));

  const currentPrice = quote ? parseFloat(quote['05. price']) : displayData[displayData.length - 1]?.close;
  const priceChange = quote ? quote['10. change percent'] : '+0.00%';

  return (
    <div className="glass-card p-5 widget-enter">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
            >
              <span className="font-display text-lg font-bold text-white">
                {selectedTicker}
              </span>
              <MagnifyingGlass size={16} className="text-gray-400" />
            </button>

            {showSearch && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-card border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden">
                <div className="p-2 border-b border-white/5">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ticker..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent/50"
                    autoFocus
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {searchLoading ? (
                    <div className="p-4 text-center text-gray-500 text-sm">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <button
                        key={result.symbol}
                        onClick={() => handleSearch(result.symbol)}
                        className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                      >
                        <div className="text-left">
                          <div className="font-bold text-white text-sm">{result.symbol}</div>
                          <div className="text-xs text-gray-500">{result.name}</div>
                        </div>
                        <ArrowRight size={16} className="text-gray-500" />
                      </button>
                    ))
                  ) : searchQuery ? (
                    <div className="p-4 text-center text-gray-500 text-sm">No results</div>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="font-mono text-2xl font-bold text-white">
              ${formatPrice(currentPrice)}
            </div>
            <div className={`font-mono text-sm ${priceChange.startsWith('+') ? 'text-accent' : 'text-negative'}`}>
              {priceChange}
            </div>
          </div>
        </div>

        <span className="live-badge">Live</span>
      </div>

      <div className="h-64">
        {loading ? (
          <div className="h-full skeleton rounded-lg" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={displayData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00ff9d" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00ff9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a25" vertical={false} />
              <XAxis
                dataKey="formattedDate"
                tick={{ fill: '#6b6b7a', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#1a1a25' }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fill: '#6b6b7a', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#13131a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                }}
                labelStyle={{ color: '#8b8b9a', fontSize: 11 }}
                itemStyle={{ color: '#00ff9d', fontFamily: 'Space Mono' }}
                formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
              />
              <Area
                type="monotone"
                dataKey="close"
                stroke="none"
                fill="url(#priceGradient)"
              />
              <Line
                type="monotone"
                dataKey="close"
                stroke="#00ff9d"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: '#00ff9d',
                  stroke: '#0a0a0f',
                  strokeWidth: 2,
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
        <div className="flex gap-6">
          <div>
            <div className="text-xs text-gray-500">Open</div>
            <div className="font-mono text-sm text-white">
              ${displayData.length > 0 ? formatPrice(displayData[displayData.length - 1].open) : '0.00'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">High</div>
            <div className="font-mono text-sm text-white">
              ${displayData.length > 0 ? formatPrice(displayData[displayData.length - 1].high) : '0.00'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Low</div>
            <div className="font-mono text-sm text-white">
              ${displayData.length > 0 ? formatPrice(displayData[displayData.length - 1].low) : '0.00'}
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500">30 Day View</div>
      </div>
    </div>
  );
};

export default StockChart;
