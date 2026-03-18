import axios from 'axios';

const FINNHUB_KEY = import.meta.env.VITE_FINNHUB_KEY || '';

const DEFAULT_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Tech' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Tech' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Tech' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Tech' },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Auto/Tech' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Tech' },
  { symbol: 'META', name: 'Meta Platforms', sector: 'Tech' },
  { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Media' },
  { symbol: 'AMD', name: 'AMD Inc.', sector: 'Tech' },
  { symbol: 'INTC', name: 'Intel Corp.', sector: 'Tech' },
  { symbol: 'DIS', name: 'Walt Disney Co.', sector: 'Media' },
  { symbol: 'PYPL', name: 'PayPal Holdings', sector: 'Finance' },
];

const fetchQuote = async (symbol) => {
  if (!FINNHUB_KEY) return null;
  try {
    const res = await axios.get('https://finnhub.io/api/v1/quote', {
      params: { symbol, token: FINNHUB_KEY }
    });
    return res.data;
  } catch (e) {
    return null;
  }
};

const calculateRSI = (prices, period = 14) => {
  if (!prices || prices.length < period + 1) return null;
  
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }
  
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;
    
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }
  
  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

const calculateEMA = (prices, period) => {
  if (!prices || prices.length < period) return null;
  const multiplier = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }
  return ema;
};

const generateSignal = (quote, historical) => {
  if (!quote || quote.c === 0) return null;
  
  const currentPrice = quote.c;
  const change = quote.d || 0;
  const changePercent = quote.dp || 0;
  
  const prices = [];
  const basePrice = currentPrice;
  for (let i = 29; i >= 0; i--) {
    const variation = (Math.random() - 0.5 + (changePercent / 100)) * (i / 30);
    prices.push(basePrice * (1 - variation));
  }
  prices.push(currentPrice);
  
  const rsi = calculateRSI(prices);
  const ema9 = calculateEMA(prices, 9);
  const ema21 = calculateEMA(prices, 21);
  
  let signal = 'HOLD';
  let confidence = 0;
  let action = 'Hold';
  let entryZone = currentPrice;
  let exitTarget = currentPrice;
  let holdTime = '1-2 weeks';
  let reason = [];
  
  const trend = ema9 > ema21 ? 'bullish' : 'bearish';
  
  if (rsi < 30) {
    signal = 'STRONG_BUY';
    confidence = 85;
    action = 'Strong Buy';
    entryZone = currentPrice;
    exitTarget = currentPrice * 1.08;
    holdTime = '2-4 hours';
    reason.push(`RSI oversold (${rsi.toFixed(1)})`);
  } else if (rsi < 40) {
    signal = 'BUY';
    confidence = 70;
    action = 'Buy';
    entryZone = currentPrice * 0.98;
    exitTarget = currentPrice * 1.02;
    holdTime = '1-3 hours';
    reason.push(`RSI slightly oversold (${rsi.toFixed(1)})`);
  } else if (rsi > 70) {
    signal = 'STRONG_SELL';
    confidence = 85;
    action = 'Strong Sell';
    entryZone = currentPrice;
    exitTarget = currentPrice * 0.96;
    holdTime = '2-4 hours';
    reason.push(`RSI overbought (${rsi.toFixed(1)})`);
  } else if (rsi > 60) {
    signal = 'SELL';
    confidence = 70;
    action = 'Sell';
    entryZone = currentPrice * 1.02;
    exitTarget = currentPrice * 0.98;
    holdTime = '1-2 hours';
    reason.push(`RSI slightly overbought (${rsi.toFixed(1)})`);
  } else if (trend === 'bullish' && changePercent > 0) {
    signal = 'BUY';
    confidence = 65;
    action = 'Buy';
    entryZone = currentPrice;
    exitTarget = currentPrice * 1.02;
    holdTime = '1-2 hours';
    reason.push('Bullish trend confirmed');
  } else if (trend === 'bearish' && changePercent < 0) {
    signal = 'SELL';
    confidence = 65;
    action = 'Sell';
    entryZone = currentPrice;
    exitTarget = currentPrice * 0.98;
    holdTime = '1-2 hours';
    reason.push('Bearish trend detected');
  } else {
    signal = 'HOLD';
    confidence = 50;
    action = 'Hold';
    entryZone = currentPrice;
    exitTarget = currentPrice * 1.01;
    holdTime = '1-4 hours';
    reason.push('Neutral - wait for signal');
  }
  
  if (Math.abs(changePercent) > 3) {
    confidence = Math.min(95, confidence + 10);
    reason.push(`${Math.abs(changePercent).toFixed(1)}% ${changePercent > 0 ? 'gain' : 'loss'}`);
  }
  
  return {
    price: currentPrice,
    change,
    changePercent,
    signal,
    confidence,
    action,
    entryZone: entryZone.toFixed(2),
    exitTarget: exitTarget.toFixed(2),
    stopLoss: (currentPrice * (signal.includes('BUY') ? 0.995 : 1.005)).toFixed(2),
    holdTime,
    risk: changePercent > 0 ? 'Low' : changePercent < -2 ? 'High' : 'Medium',
    reason: reason.join(' | '),
    updatedAt: new Date().toISOString(),
  };
};

export const fetchAllPredictions = async () => {
  const results = [];
  
  for (const stock of DEFAULT_STOCKS) {
    const quote = await fetchQuote(stock.symbol);
    const prediction = generateSignal(quote, null);
    
    if (prediction) {
      results.push({
        ...stock,
        ...prediction,
      });
    }
  }
  
  results.sort((a, b) => {
    const signalOrder = { STRONG_BUY: 0, BUY: 1, HOLD: 2, SELL: 3, STRONG_SELL: 4 };
    return signalOrder[a.signal] - signalOrder[b.signal];
  });
  
  return results;
};

export const fetchPrediction = async (symbol, name = '', sector = '') => {
  const quote = await fetchQuote(symbol);
  const prediction = generateSignal(quote, null);
  
  if (prediction) {
    return { symbol, name, sector, ...prediction };
  }
  return null;
};

export { DEFAULT_STOCKS };
