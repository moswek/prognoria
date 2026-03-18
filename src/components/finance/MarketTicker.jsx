import { useState, useEffect } from 'react';
import { Clock } from '@phosphor-icons/react';

const EXCHANGES = [
  { 
    symbol: 'NYSE', 
    name: 'New York', 
    city: 'New York', 
    timezone: 'America/New_York',
    open: '09:30', 
    close: '16:00' 
  },
  { 
    symbol: 'LSE', 
    name: 'London', 
    city: 'London', 
    timezone: 'Europe/London',
    open: '08:00', 
    close: '16:30' 
  },
  { 
    symbol: 'TSE', 
    name: 'Tokyo', 
    city: 'Tokyo', 
    timezone: 'Asia/Tokyo',
    open: '09:00', 
    close: '15:30' 
  },
  { 
    symbol: 'HKEX', 
    name: 'Hong Kong', 
    city: 'Hong Kong', 
    timezone: 'Asia/Hong_Kong',
    open: '09:30', 
    close: '16:00' 
  },
  { 
    symbol: 'SSE', 
    name: 'Shanghai', 
    city: 'Shanghai', 
    timezone: 'Asia/Shanghai',
    open: '09:30', 
    close: '15:00' 
  },
  { 
    symbol: 'FWB', 
    name: 'Frankfurt', 
    city: 'Frankfurt', 
    timezone: 'Europe/Berlin',
    open: '09:00', 
    close: '17:30' 
  },
  { 
    symbol: 'ASX', 
    name: 'Sydney', 
    city: 'Sydney', 
    timezone: 'Australia/Sydney',
    open: '10:00', 
    close: '16:00' 
  },
  { 
    symbol: 'SGX', 
    name: 'Singapore', 
    city: 'Singapore', 
    timezone: 'Asia/Singapore',
    open: '09:00', 
    close: '17:00' 
  },
];

const isMarketOpen = (exchange) => {
  const now = new Date();
  
  const dayOfWeek = new Date(now.toLocaleString('en-US', { timeZone: exchange.timezone })).getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return false;
  
  const timeStr = now.toLocaleTimeString('en-US', { 
    timeZone: exchange.timezone, 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  });
  const [currentHours, currentMinutes] = timeStr.split(':').map(Number);
  const currentTime = currentHours * 60 + currentMinutes;
  
  const [openHours, openMinutes] = exchange.open.split(':').map(Number);
  const openTime = openHours * 60 + openMinutes;
  
  const [closeHours, closeMinutes] = exchange.close.split(':').map(Number);
  const closeTime = closeHours * 60 + closeMinutes;
  
  return currentTime >= openTime && currentTime < closeTime;
};

const MarketTicker = () => {
  const [offset, setOffset] = useState(0);
  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    const updateMarkets = () => {
      setMarkets(EXCHANGES.map(exchange => {
        const time = new Date().toLocaleTimeString('en-US', {
          timeZone: exchange.timezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        const date = new Date().toLocaleDateString('en-US', {
          timeZone: exchange.timezone,
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
        return {
          ...exchange,
          time,
          date,
          isOpen: isMarketOpen(exchange)
        };
      }));
    };
    
    updateMarkets();
    const interval = setInterval(updateMarkets, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tickerInterval = setInterval(() => {
      setOffset(prev => prev - 1);
    }, 50);
    return () => clearInterval(tickerInterval);
  }, []);

  const tickerWidth = 200;
  const totalWidth = tickerWidth * markets.length * 2;

  return (
    <div className="w-full bg-card border-b border-white/5 overflow-hidden">
      <div 
        className="flex items-center"
        style={{
          transform: `translateX(${offset % totalWidth}px)`,
          transition: 'transform 0.05s linear',
        }}
      >
        {[...markets, ...markets].map((market, i) => (
          <div 
            key={`${market.symbol}-${i}`}
            className="inline-flex items-center gap-3 px-4 py-1.5 border-r border-white/5"
            style={{ minWidth: `${tickerWidth}px` }}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${market.isOpen ? 'bg-accent' : 'bg-negative'}`} />
            
            <span className="font-mono text-xs font-bold text-white">{market.symbol}</span>
            
            <span className="text-[10px] text-gray-500 truncate">{market.city}</span>
            
            <div className="flex items-center gap-1.5 ml-auto">
              <Clock size={10} className="text-gray-500 flex-shrink-0" />
              <span className="font-mono text-[11px] text-white whitespace-nowrap">{market.time}</span>
            </div>
            
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium whitespace-nowrap ${
              market.isOpen 
                ? 'bg-accent/20 text-accent' 
                : 'bg-negative/20 text-negative'
            }`}>
              {market.isOpen ? 'OPEN' : 'CLOSED'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketTicker;
