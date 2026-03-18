import useDashboardStore from '../../store/dashboardStore';
import StockPredictions from '../finance/StockPredictions';
import StockChart from '../finance/StockChart';
import TrendPredictor from '../finance/TrendPredictor';
import WatchlistTable from '../finance/WatchlistTable';
import NewsWidget from '../finance/NewsWidget';
import MarketTicker from '../finance/MarketTicker';
import TradeSimulator from '../finance/TradeSimulator';

const FinanceWidgets = () => {
  const { widgets, selectedTicker } = useDashboardStore();
  const activeWidgets = Object.entries(widgets.finance).filter(([_, active]) => active).map(([key]) => key);
  const widgetCount = activeWidgets.length;

  if (widgetCount === 0) return null;

  if (widgets.finance.stockPredictions) {
    return (
      <div className="space-y-6">
        <div>
          <StockPredictions />
        </div>
        
        {widgets.finance.tradeSimulator && (
          <div>
            <TradeSimulator />
          </div>
        )}
        
        {widgetCount > 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {widgets.finance.stockChart && (
              <div className={widgets.finance.trendPredictor || widgets.finance.newsWidget ? "lg:col-span-8" : "lg:col-span-12"}>
                <StockChart />
              </div>
            )}
            
            {widgets.finance.newsWidget && (
              <div className="lg:col-span-4">
                <NewsWidget symbol={selectedTicker} />
              </div>
            )}
            
            {widgets.finance.trendPredictor && (
              <div className="lg:col-span-4">
                <TrendPredictor />
              </div>
            )}
            
            {widgets.finance.watchlistTable && (
              <div className="lg:col-span-8">
                <WatchlistTable />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {widgets.finance.stockChart && (
        <div className={widgets.finance.trendPredictor ? "lg:col-span-8" : "lg:col-span-12"}>
          <StockChart />
        </div>
      )}
      
      {widgets.finance.trendPredictor && (
        <div className="lg:col-span-4">
          <TrendPredictor />
        </div>
      )}
      
      {widgets.finance.newsWidget && widgets.finance.watchlistTable && (
        <>
          <div className="lg:col-span-4">
            <NewsWidget symbol={selectedTicker} />
          </div>
          <div className="lg:col-span-8">
            <WatchlistTable />
          </div>
        </>
      )}
      
      {widgets.finance.newsWidget && !widgets.finance.watchlistTable && (
        <div className="lg:col-span-4">
          <NewsWidget symbol={selectedTicker} />
        </div>
      )}
      
      {!widgets.finance.newsWidget && widgets.finance.watchlistTable && (
        <div className="lg:col-span-12">
          <WatchlistTable />
        </div>
      )}
    </div>
  );
};

const DashboardGrid = () => {
  const { sectors, widgets } = useDashboardStore();

  return (
    <div className="p-6 space-y-8">
      {sectors.finance && (
        <section>
          {widgets.finance.marketTicker && (
            <div className="-mx-6 -mt-6 mb-6">
              <MarketTicker />
            </div>
          )}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-accent rounded-full" />
            <h2 className="font-display text-xl font-bold text-white">
              Finance
            </h2>
          </div>
          <FinanceWidgets />
        </section>
      )}

      {!sectors.finance && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <span className="text-3xl">0</span>
          </div>
          <p className="text-gray-500 text-center">
            Enable a sector from the sidebar to see widgets
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardGrid;
