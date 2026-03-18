export const calculateMovingAverage = (data, period) => {
  if (!data || data.length < period) return [];
  
  const result = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, d) => acc + d.close, 0);
    result.push({
      date: data[i].date,
      ma: sum / period,
    });
  }
  return result;
};

export const calculateEMA = (data, period) => {
  if (!data || data.length < period) return [];
  
  const multiplier = 2 / (period + 1);
  const result = [{ date: data[period - 1].date, ema: data.slice(0, period).reduce((a, b) => a + b.close, 0) / period }];
  
  for (let i = period; i < data.length; i++) {
    const ema = (data[i].close - result[result.length - 1].ema) * multiplier + result[result.length - 1].ema;
    result.push({ date: data[i].date, ema });
  }
  return result;
};

export const calculateRSI = (data, period = 14) => {
  if (!data || data.length < period + 1) return [];
  
  const changes = [];
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i].close - data[i - 1].close);
  }
  
  const result = [];
  let avgGain = 0;
  let avgLoss = 0;
  
  for (let i = 0; i < changes.length; i++) {
    const change = changes[i];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;
    
    if (i < period) {
      avgGain += gain;
      avgLoss += loss;
    } else if (i === period) {
      avgGain = avgGain / period;
      avgLoss = avgLoss / period;
    } else {
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
    }
    
    if (i >= period - 1) {
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      result.push({ date: data[i + 1].date, rsi: Math.round(rsi * 100) / 100 });
    }
  }
  return result;
};

export const calculateMACD = (data, fast = 12, slow = 26, signal = 9) => {
  if (!data || data.length < slow) return [];
  
  const emaFast = calculateEMA(data, fast);
  const emaSlow = calculateEMA(data, slow);
  
  if (emaFast.length === 0 || emaSlow.length === 0) return [];
  
  const macdLine = [];
  const startIdx = emaSlow.length - emaFast.length;
  for (let i = 0; i < emaFast.length; i++) {
    macdLine.push({ date: emaFast[i].date, value: emaFast[i].ema - emaSlow[startIdx + i]?.ema || 0 });
  }
  
  const signalLine = [];
  const signalMultiplier = 2 / (signal + 1);
  if (macdLine.length > 0) {
    signalLine.push({ date: macdLine[0].date, value: macdLine[0].value });
    for (let i = 1; i < macdLine.length; i++) {
      signalLine.push({
        date: macdLine[i].date,
        value: (macdLine[i].value - signalLine[signalLine.length - 1].value) * signalMultiplier + signalLine[signalLine.length - 1].value
      });
    }
  }
  
  const histogram = macdLine.map((m, i) => ({
    date: m.date,
    value: m.value - (signalLine[i]?.value || 0)
  }));
  
  return { macd: macdLine, signal: signalLine, histogram };
};

export const calculateBollingerBands = (data, period = 20, stdDev = 2) => {
  if (!data || data.length < period) return [];
  
  const result = [];
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const sma = slice.reduce((a, b) => a + b.close, 0) / period;
    const variance = slice.reduce((a, b) => a + Math.pow(b.close - sma, 2), 0) / period;
    const std = Math.sqrt(variance);
    result.push({
      date: data[i].date,
      middle: sma,
      upper: sma + (std * stdDev),
      lower: sma - (std * stdDev),
    });
  }
  return result;
};

export const calculateStochastic = (data, period = 14, kPeriod = 3, dPeriod = 3) => {
  if (!data || data.length < period) return [];
  
  const result = [];
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const high = Math.max(...slice.map(d => d.high));
    const low = Math.min(...slice.map(d => d.low));
    const close = data[i].close;
    const k = high === low ? 50 : ((close - low) / (high - low)) * 100;
    result.push({ date: data[i].date, k });
  }
  
  const d = result.map((r, i) => {
    const slice = result.slice(Math.max(0, i - dPeriod + 1), i + 1);
    return { date: r.date, value: slice.reduce((a, b) => a + b.k, 0) / slice.length };
  });
  
  return { k: result, d };
};

export const calculateVolumeProfile = (data, period = 20) => {
  if (!data || data.length < period) return { avgVolume: 0, trend: 'neutral' };
  
  const recent = data.slice(-period);
  const avgVolume = recent.reduce((a, b) => a + b.volume, 0) / period;
  const currentVolume = data[data.length - 1]?.volume || 0;
  
  const upDays = recent.filter((d, i) => i > 0 && d.close > recent[i - 1].close).length;
  const downDays = recent.filter((d, i) => i > 0 && d.close < recent[i - 1].close).length;
  
  let trend = 'neutral';
  if (upDays > downDays + 3 && currentVolume > avgVolume * 1.2) trend = 'strong_up';
  else if (downDays > upDays + 3 && currentVolume > avgVolume * 1.2) trend = 'strong_down';
  else if (upDays > downDays) trend = 'weak_up';
  else if (downDays > upDays) trend = 'weak_down';
  
  return { avgVolume, currentVolume, trend };
};

export const calculateSupportResistance = (data, period = 20) => {
  if (!data || data.length < period) return { support: 0, resistance: 0 };
  
  const recent = data.slice(-period);
  const lows = recent.map(d => d.low);
  const highs = recent.map(d => d.high);
  
  const support = Math.min(...lows);
  const resistance = Math.max(...highs);
  
  return { support, resistance };
};

export const calculateMomentum = (data, period = 10) => {
  if (!data || data.length < period + 1) return 0;
  
  const current = data[data.length - 1].close;
  const previous = data[data.length - 1 - period].close;
  return ((current - previous) / previous) * 100;
};

export const generateAdvancedTrendSignal = (data) => {
  if (!data || data.length < 30) {
    return { 
      signal: 'HOLD', 
      confidence: 0,
      reason: 'Insufficient data',
      indicators: {}
    };
  }
  
  const rsi = calculateRSI(data);
  const macd = calculateMACD(data);
  const bollinger = calculateBollingerBands(data);
  const stochastic = calculateStochastic(data);
  const momentum = calculateMomentum(data);
  const volumeProfile = calculateVolumeProfile(data);
  const sr = calculateSupportResistance(data);
  const ma9 = calculateMovingAverage(data, 9);
  const ma21 = calculateMovingAverage(data, 21);
  
  const latest = data[data.length - 1];
  const currentPrice = latest.close;
  
  let buyScore = 0;
  let sellScore = 0;
  const signals = [];
  
  if (rsi.length > 0) {
    const rsiVal = rsi[rsi.length - 1].rsi;
    if (rsiVal < 30) { buyScore += 3; signals.push(`RSI oversold (${rsiVal.toFixed(1)})`); }
    else if (rsiVal < 40) { buyScore += 1; signals.push(`RSI slightly oversold (${rsiVal.toFixed(1)})`); }
    else if (rsiVal > 70) { sellScore += 3; signals.push(`RSI overbought (${rsiVal.toFixed(1)})`); }
    else if (rsiVal > 60) { sellScore += 1; signals.push(`RSI slightly overbought (${rsiVal.toFixed(1)})`); }
  }
  
  if (macd.macd && macd.signal && macd.macd.length > 0 && macd.signal.length > 0) {
    const lastMacd = macd.macd[macd.macd.length - 1].value;
    const lastSignal = macd.signal[macd.signal.length - 1].value;
    if (lastMacd > lastSignal && macd.macd.length > 1 && macd.macd[macd.macd.length - 2].value <= macd.signal[macd.signal.length - 2]?.value) {
      buyScore += 2; signals.push('MACD bullish crossover');
    } else if (lastMacd < lastSignal && macd.macd.length > 1 && macd.macd[macd.macd.length - 2].value >= macd.signal[macd.signal.length - 2]?.value) {
      sellScore += 2; signals.push('MACD bearish crossover');
    } else if (lastMacd > lastSignal) { buyScore += 1; signals.push('MACD bullish'); }
    else if (lastMacd < lastSignal) { sellScore += 1; signals.push('MACD bearish'); }
  }
  
  if (bollinger.length > 0) {
    const bb = bollinger[bollinger.length - 1];
    if (currentPrice < bb.lower) { buyScore += 2; signals.push('Price below lower BB'); }
    else if (currentPrice < bb.middle) { buyScore += 1; signals.push('Price below middle BB'); }
    else if (currentPrice > bb.upper) { sellScore += 2; signals.push('Price above upper BB'); }
    else if (currentPrice > bb.middle) { sellScore += 1; signals.push('Price above middle BB'); }
  }
  
  if (stochastic.k && stochastic.k.length > 0) {
    const k = stochastic.k[stochastic.k.length - 1].k;
    if (k < 20) { buyScore += 2; signals.push(`Stochastic oversold (${k.toFixed(1)})`); }
    else if (k < 30) { buyScore += 1; signals.push(`Stochastic slightly oversold (${k.toFixed(1)})`); }
    else if (k > 80) { sellScore += 2; signals.push(`Stochastic overbought (${k.toFixed(1)})`); }
    else if (k > 70) { sellScore += 1; signals.push(`Stochastic slightly overbought (${k.toFixed(1)})`); }
  }
  
  if (momentum > 5) { buyScore += 2; signals.push(`Strong momentum +${momentum.toFixed(1)}%`); }
  else if (momentum > 2) { buyScore += 1; signals.push(`Positive momentum +${momentum.toFixed(1)}%`); }
  else if (momentum < -5) { sellScore += 2; signals.push(`Strong momentum ${momentum.toFixed(1)}%`); }
  else if (momentum < -2) { sellScore += 1; signals.push(`Negative momentum ${momentum.toFixed(1)}%`); }
  
  if (ma9.length > 0 && ma21.length > 0) {
    const latestMa9 = ma9[ma9.length - 1].ma;
    const latestMa21 = ma21[ma21.length - 1].ma;
    if (latestMa9 > latestMa21) { buyScore += 1; signals.push('9-day MA above 21-day MA'); }
    else { sellScore += 1; signals.push('9-day MA below 21-day MA'); }
  }
  
  if (volumeProfile.trend === 'strong_up') { buyScore += 2; signals.push('Strong volume + uptrend'); }
  else if (volumeProfile.trend === 'strong_down') { sellScore += 2; signals.push('Strong volume + downtrend'); }
  
  if (currentPrice < sr.support * 1.02) { buyScore += 1; signals.push('Near support level'); }
  else if (currentPrice > sr.resistance * 0.98) { sellScore += 1; signals.push('Near resistance level'); }
  
  const totalScore = buyScore + sellScore;
  const confidence = totalScore > 0 ? Math.abs(buyScore - sellScore) / totalScore * 100 : 0;
  
  let signal = 'HOLD';
  if (buyScore > sellScore + 2) signal = 'STRONG_BUY';
  else if (buyScore > sellScore) signal = 'BUY';
  else if (sellScore > buyScore + 2) signal = 'STRONG_SELL';
  else if (sellScore > buyScore) signal = 'SELL';
  
  const signalOrder = {
    'STRONG_BUY': 4, 'BUY': 3, 'HOLD': 2, 'SELL': 1, 'STRONG_SELL': 0
  };
  
  return {
    signal,
    confidence: Math.round(confidence),
    reason: signals.slice(0, 4).join(' | '),
    indicators: {
      rsi: rsi.length > 0 ? rsi[rsi.length - 1].rsi : null,
      macd: macd.macd?.length > 0 ? macd.macd[macd.macd.length - 1].value : null,
      momentum: momentum.toFixed(2),
      volume: volumeProfile.trend,
      support: sr.support.toFixed(2),
      resistance: sr.resistance.toFixed(2),
      buyScore,
      sellScore,
    }
  };
};

export const generateTrendSignal = (data) => {
  return generateAdvancedTrendSignal(data);
};

export const calculateFormScore = (results) => {
  const last5 = results.slice(0, 5);
  let score = 0;
  
  last5.forEach(result => {
    if (result === 'W') score += 3;
    else if (result === 'D') score += 1;
  });
  
  return score;
};

export const normalizeFormResults = (formString) => {
  if (!formString) return [];
  return formString.split('').slice(0, 5);
};

export const calculateWinProbabilities = (homeForm, awayForm) => {
  const homeScore = calculateFormScore(homeForm);
  const awayScore = calculateFormScore(awayForm);
  const totalScore = homeScore + awayScore + 1;
  
  const homeWinProb = (homeScore / totalScore) * 100;
  const awayWinProb = (awayScore / totalScore) * 100;
  const drawProb = 100 - homeWinProb - awayWinProb;
  
  const adjustedHomeWin = Math.max(15, Math.min(75, homeWinProb + 20));
  const adjustedAwayWin = Math.max(15, Math.min(75, awayWinProb + 20));
  const remaining = 100 - adjustedHomeWin - adjustedAwayWin;
  
  return {
    home: adjustedHomeWin,
    away: adjustedAwayWin,
    draw: Math.max(10, remaining),
  };
};

export const getSignalColor = (signal) => {
  switch (signal) {
    case 'BUY':
    case 'STRONG_BUY':
    case 'W':
      return '#00ff9d';
    case 'SELL':
    case 'STRONG_SELL':
    case 'L':
      return '#ff4757';
    case 'HOLD':
    case 'D':
      return '#8b8b9a';
    default:
      return '#8b8b9a';
  }
};

export const getSignalLabel = (signal) => {
  switch (signal) {
    case 'STRONG_BUY': return 'STRONG BUY';
    case 'BUY': return 'BUY';
    case 'STRONG_SELL': return 'STRONG SELL';
    case 'SELL': return 'SELL';
    case 'HOLD': return 'HOLD';
    default: return 'HOLD';
  }
};

export const formatPercentage = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return '0.00%';
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};

export const formatPrice = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return '0.00';
  return num.toFixed(2);
};
