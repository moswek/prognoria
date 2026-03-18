import { ArrowUp, ArrowDown } from '@phosphor-icons/react';
import { useWatchlist } from '../../hooks/useStockData';
import { formatPrice, formatPercentage } from '../../utils/predictions';

const WatchlistTable = () => {
  const { watchlist, loading } = useWatchlist([
    'AAPL',
    'GOOGL',
    'MSFT',
    'AMZN',
    'TSLA',
  ]);

  return (
    <div className="glass-card p-5 widget-enter">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold text-white">
          Watchlist
        </h3>
        <span className="live-badge">Top Movers</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Symbol
              </th>
              <th className="text-right py-3 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="text-right py-3 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Change
              </th>
              <th className="text-right py-3 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                % Change
              </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-4 px-2">
                      <div className="w-16 h-4 skeleton rounded" />
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="w-16 h-4 skeleton rounded ml-auto" />
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="w-16 h-4 skeleton rounded ml-auto" />
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="w-16 h-4 skeleton rounded ml-auto" />
                    </td>
                  </tr>
                ))
              : watchlist.map((stock) => {
                  const change = parseFloat(stock['09. change'] || 0);
                  const percentChange = stock['10. change percent'] || '0.00%';
                  const isPositive = change >= 0;

                  return (
                    <tr
                      key={stock.symbol}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-2">
                        <span className="font-bold text-white">
                          {stock.symbol}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <span className="font-mono text-white">
                          ${formatPrice(stock['05. price'])}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <span
                          className={`font-mono flex items-center justify-end gap-1 ${
                            isPositive ? 'text-accent' : 'text-negative'
                          }`}
                        >
                          {isPositive ? (
                            <ArrowUp size={12} weight="bold" />
                          ) : (
                            <ArrowDown size={12} weight="bold" />
                          )}
                          {Math.abs(change).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <span
                          className={`font-mono px-2 py-1 rounded text-sm ${
                            isPositive
                              ? 'bg-accent/10 text-accent'
                              : 'bg-negative/10 text-negative'
                          }`}
                        >
                          {percentChange}
                        </span>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WatchlistTable;
