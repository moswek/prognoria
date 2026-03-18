import { useMemo } from 'react';
import { TrendUp, TrendDown, Minus, ChartLine } from '@phosphor-icons/react';
import useDashboardStore from '../../store/dashboardStore';
import { useStockData } from '../../hooks/useStockData';
import { generateTrendSignal, getSignalColor, getSignalLabel } from '../../utils/predictions';

const TrendPredictor = () => {
  const { selectedTicker } = useDashboardStore();
  const { timeSeries, loading } = useStockData(selectedTicker);

  const signal = useMemo(() => {
    return generateTrendSignal(timeSeries);
  }, [timeSeries]);

  const SignalIcon = () => {
    if (signal.signal?.includes('BUY')) {
      return <TrendUp size={28} weight="fill" />;
    }
    if (signal.signal?.includes('SELL')) {
      return <TrendDown size={28} weight="fill" />;
    }
    return <Minus size={28} weight="fill" />;
  };

  const signalColors = {
    STRONG_BUY: 'bg-accent/20 border-accent/50 text-accent',
    BUY: 'bg-accent/10 border-accent/30 text-accent',
    STRONG_SELL: 'bg-negative/20 border-negative/50 text-negative',
    SELL: 'bg-negative/10 border-negative/30 text-negative',
    HOLD: 'bg-gray-500/10 border-gray-500/30 text-gray-400',
  };

  const getBorderColor = () => {
    if (signal.signal?.includes('BUY')) return 'border-accent';
    if (signal.signal?.includes('SELL')) return 'border-negative';
    return 'border-gray-600';
  };

  return (
    <div className="glass-card p-5 widget-enter h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold text-white">
          Trend Predictor
        </h3>
        <span className="text-xs text-gray-500 font-mono">{selectedTicker}</span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-40 space-y-4">
          <div className="w-16 h-16 skeleton rounded-full" />
          <div className="w-24 h-4 skeleton rounded" />
        </div>
      ) : (
        <>
          <div className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all duration-300 ${signalColors[signal.signal] || signalColors.HOLD}`}>
            <SignalIcon />
            <div className="mt-3 text-2xl font-display font-bold">
              {getSignalLabel(signal.signal) || 'HOLD'}
            </div>
            {signal.confidence > 0 && (
              <div className="mt-2 px-2 py-1 bg-black/20 rounded text-xs font-mono">
                {signal.confidence}% confidence
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Key Signals</p>
            <p className="text-xs text-gray-300 leading-relaxed">{signal.reason}</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-white/5 rounded-lg">
              <p className="text-xs text-gray-500">RSI (14)</p>
              <p className={`font-mono text-sm font-bold ${
                signal.indicators?.rsi > 70 ? 'text-negative' : 
                signal.indicators?.rsi < 30 ? 'text-accent' : 'text-white'
              }`}>
                {signal.indicators?.rsi?.toFixed(1) || 'N/A'}
              </p>
            </div>
            <div className="p-2.5 bg-white/5 rounded-lg">
              <p className="text-xs text-gray-500">Momentum</p>
              <p className={`font-mono text-sm font-bold ${
                signal.indicators?.momentum > 0 ? 'text-accent' : 
                signal.indicators?.momentum < 0 ? 'text-negative' : 'text-white'
              }`}>
                {signal.indicators?.momentum || '0'}%
              </p>
            </div>
            <div className="p-2.5 bg-white/5 rounded-lg">
              <p className="text-xs text-gray-500">Volume</p>
              <p className="font-mono text-sm text-white capitalize">
                {signal.indicators?.volume || 'neutral'}
              </p>
            </div>
            <div className="p-2.5 bg-white/5 rounded-lg">
              <p className="text-xs text-gray-500">Signal Score</p>
              <p className="font-mono text-sm">
                <span className="text-accent">{signal.indicators?.buyScore || 0}</span>
                <span className="text-gray-500"> / </span>
                <span className="text-negative">{signal.indicators?.sellScore || 0}</span>
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Support: <span className="text-accent">${signal.indicators?.support || 'N/A'}</span></span>
              <span className="text-gray-500">Resistance: <span className="text-negative">${signal.indicators?.resistance || 'N/A'}</span></span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TrendPredictor;
