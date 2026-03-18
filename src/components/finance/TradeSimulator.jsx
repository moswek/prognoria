import { useState, useEffect } from 'react';
import { CurrencyDollar, TrendUp, TrendDown, Clock, X, Play, Pause, Trash, Trophy, ChartLine } from '@phosphor-icons/react';
import useTradeStore from '../../store/tradeStore';
import useDashboardStore from '../../store/dashboardStore';
import { playSound } from '../../utils/notifications';

const TradeSimulator = () => {
  const { capital, trades, tradeHistory, setCapital, addTrade, closeTrade, clearHistory, getStats } = useTradeStore();
  const { selectedTicker } = useDashboardStore();
  const [capitalInput, setCapitalInput] = useState(capital.toString());
  const [isOpen, setIsOpen] = useState(false);

  const stats = getStats();

  const handleCapitalChange = () => {
    const newCapital = parseFloat(capitalInput);
    if (!isNaN(newCapital) && newCapital > 0) {
      setCapital(newCapital);
    }
  };

  const handleQuickTrade = (symbol, signal, price) => {
    if (signal.includes('BUY') || signal.includes('SELL')) {
      addTrade({
        symbol,
        type: signal.includes('BUY') ? 'LONG' : 'SHORT',
        signal,
        entryPrice: price,
        target: signal.includes('BUY') ? price * 1.02 : price * 0.98,
        stopLoss: signal.includes('BUY') ? price * 0.995 : price * 1.005,
      });
      playSound(signal.includes('BUY') ? 'buy' : 'sell');
    }
  };

  return (
    <div className="glass-card p-4 widget-enter">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ChartLine size={20} className="text-accent" />
          <h3 className="font-display text-base font-bold text-white">Trade Simulator</h3>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-1.5 rounded-lg transition-colors ${isOpen ? 'bg-accent/20 text-accent' : 'bg-white/5 text-gray-400'}`}
        >
          {isOpen ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>

      {isOpen && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-xs text-gray-500">Capital</p>
              <div className="flex items-center gap-2 mt-1">
                <CurrencyDollar size={14} className="text-accent" />
                <input
                  type="number"
                  value={capitalInput}
                  onChange={(e) => setCapitalInput(e.target.value)}
                  onBlur={handleCapitalChange}
                  className="w-full bg-transparent text-white font-mono text-lg font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-xs text-gray-500">Win Rate</p>
              <p className={`font-mono text-lg font-bold mt-1 ${stats.winRate >= 50 ? 'text-accent' : 'text-negative'}`}>
                {stats.winRate}%
              </p>
            </div>

            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-xs text-gray-500">Total P&L</p>
              <p className={`font-mono text-lg font-bold mt-1 flex items-center gap-1 ${stats.totalPnl >= 0 ? 'text-accent' : 'text-negative'}`}>
                {stats.totalPnl >= 0 ? <TrendUp size={16} /> : <TrendDown size={16} />}
                ${stats.totalPnl.toFixed(2)}
              </p>
            </div>

            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-xs text-gray-500">Trades</p>
              <p className="font-mono text-lg font-bold mt-1 text-white">
                {stats.wins} <span className="text-accent">W</span> / {stats.losses} <span className="text-negative">L</span>
              </p>
            </div>
          </div>

          {trades.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-500 mb-2">OPEN POSITIONS</p>
              <div className="space-y-2">
                {trades.map(trade => (
                  <div key={trade.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${trade.type === 'LONG' ? 'bg-accent' : 'bg-negative'}`} />
                      <div>
                        <p className="font-mono text-sm font-bold text-white">{trade.symbol}</p>
                        <p className="text-[10px] text-gray-500">{trade.type} @ ${trade.entryPrice.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Target</p>
                        <p className="text-xs text-accent font-mono">${trade.target.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => closeTrade(trade.id, trade.exitPrice || trade.entryPrice)}
                        className="p-1.5 hover:bg-white/10 rounded transition-colors"
                      >
                        <X size={14} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tradeHistory.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-gray-500">TRADE HISTORY</p>
                <button
                  onClick={clearHistory}
                  className="text-xs text-negative hover:underline"
                >
                  Clear All
                </button>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {tradeHistory.slice(0, 10).map(trade => (
                  <div key={trade.id} className="flex items-center justify-between p-2 bg-black/20 rounded text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${trade.type === 'LONG' ? 'text-accent' : 'text-negative'}`}>
                        {trade.type}
                      </span>
                      <span className="text-white font-mono">{trade.symbol}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">
                        {new Date(trade.closedAt).toLocaleTimeString()}
                      </span>
                      <span className={`font-mono font-bold ${trade.pnl >= 0 ? 'text-accent' : 'text-negative'}`}>
                        {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!isOpen && (
        <div className="flex items-center justify-center gap-6 py-4">
          <div className="text-center">
            <p className="font-mono text-2xl font-bold text-white">${capital.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Current Capital</p>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="text-center">
            <p className={`font-mono text-2xl font-bold ${stats.totalPnl >= 0 ? 'text-accent' : 'text-negative'}`}>
              {stats.totalPnl >= 0 ? '+' : ''}${stats.totalPnl.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">P&L</p>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="text-center">
            <p className={`font-mono text-2xl font-bold ${stats.winRate >= 50 ? 'text-accent' : 'text-negative'}`}>
              {stats.winRate}%
            </p>
            <p className="text-xs text-gray-500">Win Rate</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeSimulator;
