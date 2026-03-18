import useDashboardStore from '../../store/dashboardStore';
import StockPredictions from '../finance/StockPredictions';
import StockChart from '../finance/StockChart';
import TrendPredictor from '../finance/TrendPredictor';
import WatchlistTable from '../finance/WatchlistTable';
import NewsWidget from '../finance/NewsWidget';
import SportsPredictions from '../sports/SportsPredictions';
import FormTable from '../sports/FormTable';
import LiveScores from '../sports/LiveScores';

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
        
        {widgetCount > 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {widgets.finance.stockChart && (
              <div className="lg:col-span-8">
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
        <div className="lg:col-span-8">
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

const SportsWidgets = () => {
  const { widgets } = useDashboardStore();

  if (!widgets.sports.matchPredictor && !widgets.sports.formTable && !widgets.sports.liveScores) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {widgets.sports.matchPredictor && (
        <div className="lg:col-span-6">
          <SportsPredictions />
        </div>
      )}
      
      {widgets.sports.formTable && (
        <div className={widgets.sports.matchPredictor ? 'lg:col-span-6' : 'lg:col-span-12'}>
          <FormTable />
        </div>
      )}
      
      {widgets.sports.liveScores && (
        <div className="lg:col-span-12">
          <LiveScores />
        </div>
      )}
    </div>
  );
};

const DashboardGrid = () => {
  const { sectors } = useDashboardStore();

  return (
    <div className="p-6 space-y-8">
      {sectors.finance && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-accent rounded-full" />
            <h2 className="font-display text-xl font-bold text-white">
              Finance
            </h2>
          </div>
          <FinanceWidgets />
        </section>
      )}

      {sectors.sports && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-blue-500 rounded-full" />
            <h2 className="font-display text-xl font-bold text-white">
              Sports
            </h2>
          </div>
          <SportsWidgets />
        </section>
      )}

      {!sectors.finance && !sectors.sports && (
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
