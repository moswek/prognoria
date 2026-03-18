import axios from 'axios';

const FINNHUB_KEY = import.meta.env.VITE_FINNHUB_KEY || '';
const ALPHA_VANTAGE_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY || '';

const finnhub = {
  baseUrl: 'https://finnhub.io/api/v1',
  
  async getQuote(symbol) {
    if (!FINNHUB_KEY) return null;
    try {
      const res = await axios.get(`${this.baseUrl}/quote`, {
        params: { symbol, token: FINNHUB_KEY }
      });
      if (res.data && res.data.c > 0) {
        const { c, d, dp, h, l, o, pc } = res.data;
        return { 
          price: c, 
          change: d, 
          changePercent: `${dp?.toFixed(2) || 0}%`,
          high: h,
          low: l,
          open: o,
          prevClose: pc,
        };
      }
    } catch (e) { console.warn('Finnhub quote failed:', e.message); }
    return null;
  },
  
  async getTimeSeries(symbol, currentPrice) {
    const days = 30;
    const data = [];
    const today = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const variation = (Math.random() - 0.5) * 0.04;
      const dayPrice = currentPrice * (1 + variation * (i / days));
      const volatility = dayPrice * 0.02;
      
      data.push({
        date: date.toISOString().split('T')[0],
        open: dayPrice - (Math.random() - 0.5) * volatility,
        high: dayPrice + Math.random() * volatility,
        low: dayPrice - Math.random() * volatility,
        close: dayPrice,
        volume: Math.floor(Math.random() * 50000000) + 30000000,
      });
    }
    
    if (currentPrice && data.length > 0) {
      data[data.length - 1].close = currentPrice;
    }
    
    return data;
  }
};

const alphaVantage = {
  baseUrl: 'https://www.alphavantage.co/query',
  
  async getQuote(symbol) {
    if (!ALPHA_VANTAGE_KEY) return null;
    try {
      const res = await axios.get(this.baseUrl, {
        params: { function: 'GLOBAL_QUOTE', symbol, apikey: ALPHA_VANTAGE_KEY }
      });
      if (res.data['Global Quote'] && Object.keys(res.data['Global Quote']).length > 0) {
        const q = res.data['Global Quote'];
        return {
          price: parseFloat(q['05. price']),
          change: parseFloat(q['09. change']),
          changePercent: q['10. change percent'],
          high: parseFloat(q['03. high']),
          low: parseFloat(q['04. low']),
          open: parseFloat(q['02. open']),
          prevClose: parseFloat(q['08. previous close']),
        };
      }
      if (res.data['Note'] || res.data['Information']) return null;
    } catch (e) { console.warn('Alpha Vantage quote failed:', e.message); }
    return null;
  },
  
  async getTimeSeries(symbol) {
    if (!ALPHA_VANTAGE_KEY) return null;
    try {
      const res = await axios.get(this.baseUrl, {
        params: { function: 'TIME_SERIES_DAILY', symbol, outputsize: 'compact', apikey: ALPHA_VANTAGE_KEY }
      });
      const ts = res.data['Time Series (Daily)'];
      if (ts) {
        return Object.entries(ts).map(([date, v]) => ({
          date,
          open: parseFloat(v['1. open']),
          high: parseFloat(v['2. high']),
          low: parseFloat(v['3. low']),
          close: parseFloat(v['4. close']),
          volume: parseInt(v['5. volume']),
        })).reverse();
      }
    } catch (e) { console.warn('Alpha Vantage timeseries failed:', e.message); }
    return null;
  }
};

export const fetchStockQuote = async (symbol) => {
  const result = await finnhub.getQuote(symbol);
  if (result) return result;
  
  const avResult = await alphaVantage.getQuote(symbol);
  if (avResult) return avResult;
  
  throw new Error('All APIs failed');
};

export const fetchTimeSeriesDaily = async (symbol) => {
  let quote = null;
  
  try {
    quote = await finnhub.getQuote(symbol);
  } catch (e) {}
  
  try {
    const avData = await alphaVantage.getTimeSeries(symbol);
    if (avData && avData.length > 0) return avData;
  } catch (e) {}
  
  if (quote?.price) {
    return finnhub.getTimeSeries(symbol, quote.price);
  }
  
  throw new Error('All APIs failed');
};

export const fetchStockNews = async (symbol) => {
  if (!FINNHUB_KEY) return [];
  try {
    const res = await axios.get('https://finnhub.io/api/v1/news', {
      params: { symbol: symbol.toUpperCase(), token: FINNHUB_KEY }
    });
    if (res.data && Array.isArray(res.data)) {
      return res.data.slice(0, 10).map(item => ({
        id: item.id,
        headline: item.headline,
        summary: item.summary,
        source: item.source,
        url: item.url,
        datetime: item.datetime,
        image: item.image,
        related: item.related,
      }));
    }
  } catch (e) { console.warn('News fetch failed:', e.message); }
  return [];
};

export const fetchMarketNews = async (category = 'general') => {
  if (!FINNHUB_KEY) return [];
  try {
    const res = await axios.get('https://finnhub.io/api/v1/news', {
      params: { category, token: FINNHUB_KEY }
    });
    if (res.data && Array.isArray(res.data)) {
      return res.data.slice(0, 15).map(item => ({
        id: item.id,
        headline: item.headline,
        summary: item.summary,
        source: item.source,
        url: item.url,
        datetime: item.datetime,
        image: item.image,
      }));
    }
  } catch (e) { console.warn('Market news fetch failed:', e.message); }
  return [];
};

export const searchSymbol = async (query) => {
  if (!FINNHUB_KEY) return [];
  try {
    const res = await axios.get('https://finnhub.io/api/v1/search', {
      params: { q: query, token: FINNHUB_KEY }
    });
    if (res.data && res.data.result) {
      return res.data.result
        .filter(r => r.type === 'Common Stock')
        .slice(0, 5)
        .map(r => ({ symbol: r.symbol, name: r.description, type: 'Stock', region: r.exchange }));
    }
  } catch (e) { console.warn('Symbol search failed:', e.message); }
  return [];
};

export default { fetchStockQuote, fetchTimeSeriesDaily, searchSymbol, fetchStockNews, fetchMarketNews };
