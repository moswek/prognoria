import { useState, useEffect, useCallback } from 'react';
import { Newspaper, Bell, X, Clock, ArrowSquareOut } from '@phosphor-icons/react';
import { format, formatDistanceToNow } from 'date-fns';
import { fetchStockNews, fetchMarketNews } from '../../services/stockAPI';

const NEWS_MOCK = [
  {
    id: 1,
    headline: 'Tech stocks rally as Fed signals potential rate cut',
    summary: 'Major technology companies saw significant gains after Federal Reserve officials hinted at possible interest rate reductions in the coming months.',
    source: 'Reuters',
    datetime: Date.now() - 3600000,
    image: null,
  },
  {
    id: 2,
    headline: 'Apple announces new AI features for iPhone',
    summary: 'Apple revealed its latest artificial intelligence capabilities coming to iPhone, sending shares higher in after-hours trading.',
    source: 'Bloomberg',
    datetime: Date.now() - 7200000,
    image: null,
  },
  {
    id: 3,
    headline: 'Tesla beats Q4 delivery expectations',
    summary: 'Tesla reported better-than-expected vehicle deliveries for the fourth quarter, exceeding analyst estimates by a significant margin.',
    source: 'CNBC',
    datetime: Date.now() - 14400000,
    image: null,
  },
];

export const useStockNews = (symbol, autoRefresh = true, refreshInterval = 120000) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async () => {
    try {
      let data = await fetchStockNews(symbol);
      if (!data || data.length === 0) {
        data = await fetchMarketNews('technology');
      }
      setNews(data.length > 0 ? data : NEWS_MOCK);
    } catch (err) {
      console.warn('Using mock news:', err.message);
      setNews(NEWS_MOCK);
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchNews();
    if (autoRefresh) {
      const interval = setInterval(fetchNews, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchNews, autoRefresh, refreshInterval]);

  return { news, loading, error, refetch: fetchNews };
};

const NewsCard = ({ article, onClose }) => {
  const timeAgo = formatDistanceToNow(new Date(article.datetime * 1000 || article.datetime), { addSuffix: true });
  
  return (
    <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-accent font-medium">{article.source}</span>
            <span className="text-xs text-gray-500">{timeAgo}</span>
          </div>
          <h4 className="text-sm font-medium text-white leading-snug mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {article.headline}
          </h4>
          <p className="text-xs text-gray-400 line-clamp-2">{article.summary}</p>
        </div>
        {article.image && (
          <img src={article.image} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
        )}
      </div>
      <a 
        href={article.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-1 mt-3 text-xs text-gray-500 hover:text-accent transition-colors"
      >
        Read more <ArrowSquareOut size={12} />
      </a>
    </div>
  );
};

const NewsWidget = ({ symbol = 'AAPL' }) => {
  const { news, loading } = useStockNews(symbol);
  const [showAll, setShowAll] = useState(false);

  const displayNews = showAll ? news : news.slice(0, 3);

  return (
    <div className="glass-card p-5 widget-enter">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper size={20} className="text-accent" />
          <h3 className="font-display text-lg font-bold text-white">News</h3>
          <span className="text-xs text-gray-500">- {symbol}</span>
        </div>
        <span className="live-badge">Live</span>
      </div>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 bg-white/5 rounded-xl">
              <div className="flex gap-2 mb-2">
                <div className="w-16 h-3 skeleton rounded" />
                <div className="w-12 h-3 skeleton rounded" />
              </div>
              <div className="w-full h-4 skeleton rounded mb-2" />
              <div className="w-3/4 h-3 skeleton rounded" />
            </div>
          ))
        ) : displayNews.length > 0 ? (
          displayNews.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No news available
          </div>
        )}
      </div>

      {news.length > 3 && (
        <button 
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-2 text-sm text-gray-400 hover:text-accent transition-colors"
        >
          {showAll ? 'Show less' : `Show ${news.length - 3} more`}
        </button>
      )}
    </div>
  );
};

export default NewsWidget;
