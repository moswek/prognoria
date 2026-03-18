import axios from 'axios';

const BASE_URL = 'https://www.alphavantage.co/query';
const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY || 'demo';

export const fetchStockQuote = async (symbol) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: API_KEY,
      },
    });
    
    if (response.data['Global Quote']) {
      return response.data['Global Quote'];
    }
    if (response.data['Note'] || response.data['Information']) {
      console.warn('API rate limit hit, using mock data');
      return null;
    }
    throw new Error('No quote data available');
  } catch (error) {
    console.error('Error fetching stock quote:', error.message);
    throw error;
  }
};

export const fetchTimeSeriesDaily = async (symbol, outputSize = 'compact') => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol,
        outputsize: outputSize,
        apikey: API_KEY,
      },
    });
    
    const timeSeries = response.data['Time Series (Daily)'];
    if (timeSeries) {
      const data = Object.entries(timeSeries).map(([date, values]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume']),
      }));
      return data.reverse();
    }
    if (response.data['Note'] || response.data['Information']) {
      console.warn('API rate limit hit, using mock data');
      return null;
    }
    throw new Error('No time series data available');
  } catch (error) {
    console.error('Error fetching time series:', error.message);
    throw error;
  }
};

export const fetchRSI = async (symbol, period = 14) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'RSI',
        symbol,
        interval: 'daily',
        time_period: period,
        series_type: 'close',
        apikey: API_KEY,
      },
    });
    
    const rsiData = response.data['Technical Analysis: RSI'];
    if (rsiData) {
      const data = Object.entries(rsiData).map(([date, values]) => ({
        date,
        rsi: parseFloat(values['RSI']),
      }));
      return data.reverse();
    }
    return null;
  } catch (error) {
    console.error('Error fetching RSI:', error.message);
    return null;
  }
};

export const fetchMACD = async (symbol) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'MACD',
        symbol,
        interval: 'daily',
        series_type: 'close',
        apikey: API_KEY,
      },
    });
    
    const macdData = response.data['Technical Analysis: MACD'];
    if (macdData) {
      const data = Object.entries(macdData).map(([date, values]) => ({
        date,
        macd: parseFloat(values['MACD']),
        signal: parseFloat(values['MACD_Signal']),
        histogram: parseFloat(values['MACD_Hist']),
      }));
      return data.reverse();
    }
    return null;
  } catch (error) {
    console.error('Error fetching MACD:', error.message);
    return null;
  }
};

export const fetchIntraday = async (symbol, interval = '5min') => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol,
        interval,
        apikey: API_KEY,
      },
    });
    
    const timeSeries = response.data[`Time Series (${interval})`];
    if (timeSeries) {
      const data = Object.entries(timeSeries).map(([datetime, values]) => ({
        datetime,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume']),
      }));
      return data.reverse();
    }
    throw new Error('No intraday data available');
  } catch (error) {
    console.error('Error fetching intraday:', error.message);
    throw error;
  }
};

export const searchSymbol = async (query) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: query,
        apikey: API_KEY,
      },
    });
    
    if (response.data.bestMatches) {
      return response.data.bestMatches.map(match => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region'],
      }));
    }
    return [];
  } catch (error) {
    console.error('Error searching symbol:', error.message);
    return [];
  }
};
