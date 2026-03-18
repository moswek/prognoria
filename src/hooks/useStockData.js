import { useState, useEffect, useCallback } from 'react';
import { fetchStockQuote, fetchTimeSeriesDaily, searchSymbol } from '../services/stockAPI';

const MOCK_QUOTES = {
  AAPL: { price: 178.52, change: 2.34, changePercent: '+1.33%' },
  GOOGL: { price: 141.80, change: -1.20, changePercent: '-0.84%' },
  MSFT: { price: 378.91, change: 4.56, changePercent: '+1.22%' },
  AMZN: { price: 178.25, change: 3.12, changePercent: '+1.78%' },
  TSLA: { price: 248.50, change: -5.67, changePercent: '-2.23%' },
  NVDA: { price: 875.28, change: 15.43, changePercent: '+1.79%' },
  META: { price: 505.95, change: 8.22, changePercent: '+1.65%' },
  NFLX: { price: 628.40, change: -3.50, changePercent: '-0.55%' },
};

const generateMockTimeSeries = () => {
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const basePrice = 170 + Math.sin(i * 0.3) * 15 + Math.random() * 5;
    return {
      date: date.toISOString().split('T')[0],
      open: basePrice - Math.random() * 2,
      high: basePrice + Math.random() * 3,
      low: basePrice - Math.random() * 3,
      close: basePrice + (Math.random() - 0.5) * 4,
      volume: Math.floor(Math.random() * 50000000) + 30000000,
    };
  });
};

const MOCK_TIME_SERIES = generateMockTimeSeries();

const formatQuoteForDisplay = (quote) => {
  if (!quote) return null;
  if (quote['05. price']) {
    return quote;
  }
  if (quote.price !== undefined) {
    return {
      '05. price': quote.price.toFixed(2),
      '09. change': (quote.change >= 0 ? '+' : '') + quote.change.toFixed(2),
      '10. change percent': quote.changePercent,
    };
  }
  return null;
};

export const useStockData = (symbol, autoRefresh = false, refreshInterval = 60000) => {
  const [quote, setQuote] = useState(null);
  const [timeSeries, setTimeSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    let quoteData = null;
    let timeSeriesData = null;
    
    try {
      quoteData = await fetchStockQuote(symbol);
    } catch (e) {
      console.warn('Quote fetch failed:', e.message);
    }
    
    try {
      timeSeriesData = await fetchTimeSeriesDaily(symbol);
    } catch (e) {
      console.warn('Time series fetch failed:', e.message);
    }
    
    const formattedQuote = formatQuoteForDisplay(quoteData);
    if (formattedQuote) {
      setQuote(formattedQuote);
    } else {
      const mockQuote = MOCK_QUOTES[symbol] || MOCK_QUOTES.AAPL;
      setQuote({
        '05. price': mockQuote.price.toFixed(2),
        '09. change': (mockQuote.change >= 0 ? '+' : '') + mockQuote.change.toFixed(2),
        '10. change percent': mockQuote.changePercent,
      });
    }
    
    if (timeSeriesData && timeSeriesData.length > 0) {
      setTimeSeries(timeSeriesData);
    } else {
      setTimeSeries(MOCK_TIME_SERIES);
    }
    
    setLoading(false);
  }, [symbol]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchData]);

  return { quote, timeSeries, loading, error, refetch: fetchData };
};

export const useWatchlist = (tickers = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA']) => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      setLoading(true);
      const results = [];
      
      for (const ticker of tickers) {
        try {
          const quote = await fetchStockQuote(ticker);
          if (quote) {
            const formatted = formatQuoteForDisplay(quote);
            if (formatted) {
              results.push({ symbol: ticker, ...formatted });
              continue;
            }
          }
        } catch (e) {
          console.warn(`Failed to fetch ${ticker}`);
        }
        
        const mock = MOCK_QUOTES[ticker];
        if (mock) {
          results.push({
            symbol: ticker,
            '05. price': mock.price.toFixed(2),
            '09. change': (mock.change >= 0 ? '+' : '') + mock.change.toFixed(2),
            '10. change percent': mock.changePercent,
          });
        }
      }
      
      if (results.length === 0) {
        tickers.forEach(ticker => {
          const mock = MOCK_QUOTES[ticker];
          if (mock) {
            results.push({
              symbol: ticker,
              '05. price': mock.price.toFixed(2),
              '09. change': (mock.change >= 0 ? '+' : '') + mock.change.toFixed(2),
              '10. change percent': mock.changePercent,
            });
          }
        });
      }
      
      setWatchlist(results);
      setLoading(false);
    };

    fetchWatchlist();
    const interval = setInterval(fetchWatchlist, 60000);
    return () => clearInterval(interval);
  }, [tickers.join(',')]);

  return { watchlist, loading };
};

export const useSymbolSearch = (query) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 1) {
      setResults([]);
      return;
    }

    const searchTimer = setTimeout(async () => {
      setLoading(true);
      try {
        const searchResults = await searchSymbol(query);
        setResults(searchResults.slice(0, 5));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [query]);

  return { results, loading };
};
