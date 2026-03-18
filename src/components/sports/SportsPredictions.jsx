import { useState, useEffect } from 'react';
import { Trophy, ArrowUp, ArrowDown, Calendar } from '@phosphor-icons/react';
import { format } from 'date-fns';
import { useSportsData, generateMatchPrediction, LEAGUES } from '../../hooks/useSportsData';

const getSignalConfig = (recommendation) => {
  switch (recommendation) {
    case 'BET_HOME':
      return { color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/40', label: 'HOME', icon: ArrowUp };
    case 'BET_AWAY':
      return { color: 'text-negative', bg: 'bg-negative/10', border: 'border-negative/40', label: 'AWAY', icon: ArrowDown };
    case 'BET_DRAW':
      return { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/40', label: 'DRAW', icon: Trophy };
    default:
      return { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/30', label: 'TBD', icon: Trophy };
  }
};

const PredictionCard = ({ prediction }) => {
  const config = getSignalConfig(prediction.recommendation);
  const Icon = config.icon;
  
  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg border ${config.border} ${config.bg} hover:bg-white/5 transition-colors`}>
      <div className="flex-shrink-0 text-center w-14">
        <Icon size={16} weight="bold" className={config.color} />
        <p className="text-[10px] text-gray-400 mt-1">{prediction.confidence}%</p>
      </div>
      
      <div className="flex-1 flex items-center justify-between min-w-0">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm truncate">{prediction.homeTeam}</p>
          <div className="flex gap-0.5 mt-1">
            {prediction.homeForm.split('').slice(0, 5).map((r, i) => (
              <span key={i} className={`w-5 h-5 rounded text-[9px] flex items-center justify-center font-bold ${
                r === 'W' ? 'bg-accent/20 text-accent' : r === 'D' ? 'bg-gray-500/20 text-gray-400' : 'bg-negative/20 text-negative'
              }`}>{r}</span>
            ))}
          </div>
        </div>
        
        <div className="px-4 text-center flex-shrink-0">
          <p className="text-[10px] text-gray-500 mb-0.5">{prediction.date}</p>
          <p className="text-sm font-bold text-white">VS</p>
        </div>
        
        <div className="flex-1 min-w-0 text-right">
          <p className="font-semibold text-white text-sm truncate">{prediction.awayTeam}</p>
          <div className="flex gap-0.5 mt-1 justify-end">
            {prediction.awayForm.split('').slice(0, 5).map((r, i) => (
              <span key={i} className={`w-5 h-5 rounded text-[9px] flex items-center justify-center font-bold ${
                r === 'W' ? 'bg-negative/20 text-negative' : r === 'D' ? 'bg-gray-500/20 text-gray-400' : 'bg-accent/20 text-accent'
              }`}>{r}</span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex-shrink-0 flex gap-3">
        <div className="text-center">
          <p className="text-[10px] text-gray-500">H</p>
          <p className="font-mono text-sm text-accent">{prediction.homeProb}%</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-500">D</p>
          <p className="font-mono text-sm text-yellow-400">{prediction.drawProb}%</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-500">A</p>
          <p className="font-mono text-sm text-negative">{prediction.awayProb}%</p>
        </div>
      </div>
    </div>
  );
};

const SportsPredictions = () => {
  const [selectedLeague, setSelectedLeague] = useState(4328);
  const { upcoming, past, loading } = useSportsData(selectedLeague);
  const [predictions, setPredictions] = useState([]);
  
  useEffect(() => {
    console.log('Upcoming matches:', upcoming.length, 'Past matches:', past.length);
    
    if (upcoming.length > 0) {
      const preds = upcoming.slice(0, 8).map(match => {
        const prediction = generateMatchPrediction(match.strHomeTeam, match.strAwayTeam, past);
        return {
          ...prediction,
          date: match.dateEvent ? format(new Date(match.dateEvent), 'MMM dd') : 'TBD',
        };
      });
      setPredictions(preds);
      console.log('Generated predictions:', preds.length);
    }
  }, [upcoming, past]);
  
  const homeWins = predictions.filter(p => p.recommendation === 'BET_HOME');
  const awayWins = predictions.filter(p => p.recommendation === 'BET_AWAY');
  const draws = predictions.filter(p => p.recommendation === 'BET_DRAW');

  return (
    <div className="glass-card p-5 widget-enter h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy size={20} className="text-blue-400" />
          <h3 className="font-display text-lg font-bold text-white">Match Predictions</h3>
        </div>
        <span className="live-badge">Live</span>
      </div>
      
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {LEAGUES.slice(0, 5).map(league => (
          <button
            key={league.id}
            onClick={() => setSelectedLeague(league.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
              selectedLeague === league.id 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            {league.short}
          </button>
        ))}
      </div>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
              <div className="w-14 h-10 skeleton rounded" />
              <div className="flex-1 h-12 skeleton rounded" />
              <div className="w-24 h-10 skeleton rounded" />
            </div>
          ))
        ) : predictions.length > 0 ? (
          predictions.map((pred, i) => (
            <PredictionCard key={i} prediction={pred} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No upcoming matches for this league
          </div>
        )}
      </div>
      
      {predictions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex justify-center gap-6 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent" /> 
              <span className="text-gray-400">Home: {homeWins.length}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-400" /> 
              <span className="text-gray-400">Draw: {draws.length}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-negative" /> 
              <span className="text-gray-400">Away: {awayWins.length}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SportsPredictions;
