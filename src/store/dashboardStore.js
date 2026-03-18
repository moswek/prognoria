import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useDashboardStore = create(
  persist(
    (set, get) => ({
      sectors: {
        finance: true,
        sports: true,
      },
      
      widgets: {
        finance: {
          stockPredictions: true,
          stockChart: true,
          trendPredictor: false,
          watchlistTable: false,
          newsWidget: true,
        },
        sports: {
          matchPredictor: true,
          formTable: true,
          liveScores: true,
        },
      },
      
      selectedTicker: 'AAPL',
      
      newsAlerts: [],
      lastNewsCount: {},
      
      toggleSector: (sector) => set((state) => ({
        sectors: {
          ...state.sectors,
          [sector]: !state.sectors[sector],
        },
      })),
      
      toggleWidget: (sector, widget) => set((state) => ({
        widgets: {
          ...state.widgets,
          [sector]: {
            ...state.widgets[sector],
            [widget]: !state.widgets[sector][widget],
          },
        },
      })),
      
      setSelectedTicker: (ticker) => set({ selectedTicker: ticker }),
      
      addAlert: (alert) => set((state) => ({
        newsAlerts: [
          { ...alert, id: Date.now(), timestamp: new Date().toISOString() },
          ...state.newsAlerts.slice(0, 19),
        ],
      })),
      
      clearAlerts: () => set({ newsAlerts: [] }),
      
      dismissAlert: (alertId) => set((state) => ({
        newsAlerts: state.newsAlerts.filter(a => a.id !== alertId),
      })),
      
      updateNewsCount: (symbol, count) => set((state) => {
        const prevCount = state.lastNewsCount[symbol] || 0;
        const newCount = count;
        
        if (newCount > prevCount && prevCount > 0) {
          const newAlert = {
            type: 'news',
            title: 'New News Available',
            message: `${symbol} has ${newCount - prevCount} new article${newCount - prevCount > 1 ? 's' : ''}`,
            symbol,
          };
          
          return {
            lastNewsCount: { ...state.lastNewsCount, [symbol]: newCount },
            newsAlerts: [
              { ...newAlert, id: Date.now(), timestamp: new Date().toISOString() },
              ...state.newsAlerts.slice(0, 19),
            ],
          };
        }
        
        return { lastNewsCount: { ...state.lastNewsCount, [symbol]: newCount } };
      }),
      
      getActiveWidgetCount: () => {
        const state = get();
        let count = 0;
        if (state.sectors.finance) {
          count += Object.values(state.widgets.finance).filter(Boolean).length;
        }
        if (state.sectors.sports) {
          count += Object.values(state.widgets.sports).filter(Boolean).length;
        }
        return count;
      },
      
      getActiveSectors: () => {
        const state = get();
        return Object.entries(state.sectors)
          .filter(([_, active]) => active)
          .map(([sector]) => sector);
      },
    }),
    {
      name: 'prognoria-storage',
    }
  )
);

export default useDashboardStore;
