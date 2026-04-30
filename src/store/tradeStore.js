import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTradeStore = create(
  persist(
    (set, get) => ({
      capital: 10000,
      trades: [],
      tradeHistory: [],
      isSimulating: false,

      setCapital: (capital) => set({ capital: parseFloat(capital) || 0 }),

      addTrade: (trade) => {
        const { trades, capital } = get();
        const newTrade = {
          ...trade,
          id: Date.now(),
          status: 'open',
          openedAt: new Date().toISOString(),
          entryPrice: trade.entryPrice,
          quantity: Math.floor(capital * 0.1 / trade.entryPrice),
        };
        set({ trades: [...trades, newTrade] });
        return newTrade;
      },

      closeTrade: (tradeId, exitPrice) => {
        const { trades, tradeHistory, capital } = get();
        const trade = trades.find(t => t.id === tradeId);
        if (!trade) return;

        const pnl = (exitPrice - trade.entryPrice) * trade.quantity;
        const pnlPercent = ((exitPrice - trade.entryPrice) / trade.entryPrice) * 100;

        const closedTrade = {
          ...trade,
          status: 'closed',
          closedAt: new Date().toISOString(),
          exitPrice,
          pnl,
          pnlPercent,
          capital: capital + pnl,
        };

        set({
          trades: trades.filter(t => t.id !== tradeId),
          tradeHistory: [closedTrade, ...tradeHistory],
          capital: capital + pnl,
        });

        return closedTrade;
      },

      closeAllTrades: (currentPrices) => {
        const { trades } = get();
        trades.forEach(trade => {
          const price = currentPrices[trade.symbol];
          if (price) {
            get().closeTrade(trade.id, price);
          }
        });
      },

      clearHistory: () => set({ tradeHistory: [], trades: [] }),

      getStats: () => {
        const { tradeHistory, trades, capital } = get();
        const closed = tradeHistory;
        const totalTrades = closed.length;
        const wins = closed.filter(t => t.pnl > 0).length;
        const losses = closed.filter(t => t.pnl <= 0).length;
        const totalPnl = closed.reduce((sum, t) => sum + t.pnl, 0);
        const winRate = totalTrades > 0 ? (wins / totalTrades * 100).toFixed(1) : 0;
        
        // Calculate additional portfolio metrics
        const avgWin = wins > 0 ? closed.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0) / wins : 0;
        const avgLoss = losses > 0 ? closed.filter(t => t.pnl <= 0).reduce((sum, t) => sum + t.pnl, 0) / losses : 0;
        const profitFactor = Math.abs(avgLoss) > 0 ? Math.abs(avgWin / avgLoss) : 0;
        
        // Calculate win/loss ratio
        const winLossRatio = avgLoss !== 0 ? Math.abs(avgWin / avgLoss) : 0;
        
        // Calculate maximum drawdown
        let maxDrawdown = 0;
        let peak = 10000; // Starting capital
        let currentValue = peak;
        
        // Sort trades by date for accurate drawdown calculation
        const sortedClosed = [...closed].sort((a, b) => 
          new Date(a.closedAt) - new Date(b.closedAt)
        );
        
        sortedClosed.forEach(trade => {
          currentValue += trade.pnl;
          if (currentValue > peak) {
            peak = currentValue;
          }
          const drawdown = (peak - currentValue) / peak * 100;
          if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown;
          }
        });
        
        // Calculate Sharpe ratio (simplified, assuming risk-free rate of 0)
        const returns = closed.map(t => t.pnl / 10000); // Assuming 10k base capital
        const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length || 0;
        const returnStdDev = Math.sqrt(
          returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
        ) || 0;
        const sharpeRatio = returnStdDev !== 0 ? avgReturn / returnStdDev * Math.sqrt(252) : 0; // Annualized

        return {
          totalTrades,
          openTrades: trades.length,
          wins,
          losses,
          totalPnl,
          winRate,
          avgWin: parseFloat(avgWin.toFixed(2)),
          avgLoss: parseFloat(avgLoss.toFixed(2)),
          profitFactor: parseFloat(profitFactor.toFixed(2)),
          winLossRatio: parseFloat(winLossRatio.toFixed(2)),
          maxDrawdown: parseFloat(maxDrawdown.toFixed(2)),
          sharpeRatio: parseFloat(sharpeRatio.toFixed(2)),
          currentCapital: parseFloat(capital.toFixed(2)),
        };
      },
    }),
    {
      name: 'prognoria-trades',
    }
  )
);

export default useTradeStore;
