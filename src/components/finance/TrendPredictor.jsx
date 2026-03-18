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
      return <TrendUp size={24} weight="fill" />;
    }
    if (signal.signal?.includes('SELL')) {
      return <TrendDown size={24} weight="fill" />;
    }
    return <Minus size={24} weight="fill" />;
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
    <div className="glass-card p-4 widget-enter flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-sm font-bold text-white">
          Trend Predictor
        </h3>
        <span className="text-xs text-gray-500 font-mono">{selectedTicker}</span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-28 space-y-3">
          <div className="w-12 h-12 skeleton rounded-full" />
          <div className="w-20 h-4 skeleton rounded" />
        </div>
      ) : (
        <>
          <div className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-300 ${signalColors[signal.signal] || signalColors.HOLD}`}>
            <SignalIcon />
            <div className="mt-1 text-base font-display font-bold">
              {getSignalLabel(signal.signal) || 'HOLD'}
            </div>
            {signal.confidence > 0 && (
              <div className="text-xs font-mono">
                {signal.confidence}%
              </div>
            )}
          </div>

          <div className="mt-2 p-2 bg-white/5 rounded">
            <p className="text-xs text-gray-500">Key Signals</p>
            <p className="text-xs text-gray-300">{signal.reason}</p>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="p-2 bg-white/5 rounded">
              <p className="text-xs text-gray-500">RSI (14)</p>
              <p className={`font-mono text-sm font-bold ${
                signal.indicators?.rsi > 70 ? 'text-negative' : 
                signal.indicators?.rsi < 30 ? 'text-accent' : 'text-white'
              }`}>
                {signal.indicators?.rsi?.toFixed(1) || 'N/A'}
              </p>
            </div>
            <div className="p-2 bg-white/5 rounded">
              <p className="text-xs text-gray-500">Momentum</p>
              <p className={`font-mono text-sm font-bold ${
                signal.indicators?.momentum > 0 ? 'text-accent' : 
                signal.indicators?.momentum < 0 ? 'text-negative' : 'text-white'
              }`}>
                {signal.indicators?.momentum || '0'}%
              </p>
            </div>
          </div>

          <div className="mt-auto pt-2 border-t border-white/5">
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
