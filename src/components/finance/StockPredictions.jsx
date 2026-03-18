import { useState, useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown, Clock, Warning, ChartLine, Bell } from '@phosphor-icons/react';
import { fetchAllPredictions, DEFAULT_STOCKS } from '../../services/predictions';
import useDashboardStore from '../../store/dashboardStore';

const getSignalConfig = (signal) => {
  switch (signal) {
    case 'STRONG_BUY':
      return { color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/30', label: 'STRONG BUY' };
    case 'BUY':
      return { color: 'text-accent/80', bg: 'bg-accent/5', border: 'border-accent/20', label: 'BUY' };
    case 'STRONG_SELL':
      return { color: 'text-negative', bg: 'bg-negative/10', border: 'border-negative/30', label: 'STRONG SELL' };
    case 'SELL':
      return { color: 'text-negative/80', bg: 'bg-negative/5', border: 'border-negative/20', label: 'SELL' };
    default:
      return { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', label: 'HOLD' };
  }
};

const PredictionCard = ({ stock, onSelect }) => {
  const config = getSignalConfig(stock.signal);
  const isPositive = stock.change >= 0;

  return (
    <div 
      onClick={() => onSelect(stock.symbol)}
      className={`p-4 rounded-xl border ${config.border} ${config.bg} hover:scale-[1.02] transition-all cursor-pointer group`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-white">{stock.symbol}</span>
            <span className={`px-2 py-0.5 text-xs font-bold rounded ${config.bg} ${config.color}`}>
              {config.label}
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate max-w-[120px]">{stock.name}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg font-bold text-white">${stock.price.toFixed(2)}</p>
          <p className={`font-mono text-sm flex items-center justify-end gap-1 ${isPositive ? 'text-accent' : 'text-negative'}`}>
            {isPositive ? <ArrowUp size={12} weight="bold" /> : <ArrowDown size={12} weight="bold" />}
            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="p-2 bg-black/20 rounded">
          <p className="text-gray-500">Entry</p>
          <p className="font-mono text-white">${stock.entryZone}</p>
        </div>
        <div className="p-2 bg-black/20 rounded">
          <p className="text-gray-500">Exit</p>
          <p className="font-mono text-white">${stock.exitTarget}</p>
        </div>
        <div className="p-2 bg-black/20 rounded">
          <p className="text-gray-500">Stop</p>
          <p className="font-mono text-negative">${stock.stopLoss}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock size={12} />
          <span>{stock.holdTime}</span>
        </div>
        <div className={`text-xs px-2 py-0.5 rounded ${
          stock.risk === 'Low' ? 'bg-accent/10 text-accent' :
          stock.risk === 'High' ? 'bg-negative/10 text-negative' :
          'bg-yellow-500/10 text-yellow-400'
        }`}>
          {stock.risk} Risk
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-white/5">
        <p className="text-xs text-gray-500 truncate">{stock.reason}</p>
      </div>
    </div>
  );
};

const StockPredictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const alertedRef = useRef(new Set());
  const { setSelectedTicker, addAlert } = useDashboardStore();

  const fetchPredictions = async () => {
    try {
      const data = await fetchAllPredictions();
      
      const buyOrSellSignals = data.filter(d => 
        (d.signal.includes('BUY') || d.signal.includes('SELL'))
      );
      
      buyOrSellSignals.forEach(stock => {
        const alertKey = `${stock.symbol}-${stock.signal}`;
        if (!alertedRef.current.has(alertKey)) {
          alertedRef.current.add(alertKey);
          addAlert({
            type: 'price',
            title: `${stock.signal.replace('_', ' ')} Signal`,
            message: `${stock.symbol} at $${stock.price.toFixed(2)} - ${stock.action}`,
            symbol: stock.symbol,
          });
        }
      });
      
      setPredictions(data);
      setLastUpdate(new Date());
    } catch (e) {
      console.error('Predictions fetch failed:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
    const interval = setInterval(fetchPredictions, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectStock = (symbol) => {
    setSelectedTicker(symbol);
  };

  const strongBuys = predictions.filter(p => p.signal === 'STRONG_BUY' || p.signal === 'BUY');
  const strongSells = predictions.filter(p => p.signal === 'STRONG_SELL' || p.signal === 'SELL');
  const holds = predictions.filter(p => p.signal === 'HOLD');

  return (
    <div className="glass-card p-5 widget-enter">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ChartLine size={20} className="text-accent" />
          <h3 className="font-display text-lg font-bold text-white">Stock Signals</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {lastUpdate ? `Updated ${lastUpdate.toLocaleTimeString()}` : ''}
          </span>
          <span className="live-badge">Live</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 bg-white/5 rounded-xl">
              <div className="flex justify-between mb-3">
                <div className="w-20 h-6 skeleton rounded" />
                <div className="w-16 h-6 skeleton rounded" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-10 skeleton rounded" />
                <div className="h-10 skeleton rounded" />
                <div className="h-10 skeleton rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {strongBuys.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-accent mb-2 flex items-center gap-1">
                <ArrowUp size={12} weight="bold" /> BUY SIGNALS ({strongBuys.length})
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {strongBuys.map(stock => (
                  <PredictionCard key={stock.symbol} stock={stock} onSelect={handleSelectStock} />
                ))}
              </div>
            </div>
          )}

          {holds.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1">
                HOLD SIGNALS ({holds.length})
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {holds.map(stock => (
                  <PredictionCard key={stock.symbol} stock={stock} onSelect={handleSelectStock} />
                ))}
              </div>
            </div>
          )}

          {strongSells.length > 0 && (
            <div>
              <p className="text-xs font-bold text-negative mb-2 flex items-center gap-1">
                <ArrowDown size={12} weight="bold" /> SELL SIGNALS ({strongSells.length})
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {strongSells.map(stock => (
                  <PredictionCard key={stock.symbol} stock={stock} onSelect={handleSelectStock} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>12 stocks tracked</span>
          <button 
            onClick={fetchPredictions}
            className="text-accent hover:underline"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockPredictions;
