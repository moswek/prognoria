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
        const { tradeHistory, trades } = get();
        const closed = tradeHistory;
        const totalTrades = closed.length;
        const wins = closed.filter(t => t.pnl > 0).length;
        const losses = closed.filter(t => t.pnl <= 0).length;
        const totalPnl = closed.reduce((sum, t) => sum + t.pnl, 0);
        const winRate = totalTrades > 0 ? (wins / totalTrades * 100).toFixed(1) : 0;

        return {
          totalTrades,
          openTrades: trades.length,
          wins,
          losses,
          totalPnl,
          winRate,
        };
      },
    }),
    {
      name: 'prognoria-trades',
    }
  )
);

export default useTradeStore;
