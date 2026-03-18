import { useState, useEffect } from 'react';
import { Trophy, ArrowUp, ArrowDown, Calendar, MagnifyingGlass } from '@phosphor-icons/react';
import { format } from 'date-fns';
import { useSportsData, useTeamSearch, generateMatchPrediction, LEAGUES } from '../../hooks/useSportsData';

const getSignalConfig = (recommendation) => {
  switch (recommendation) {
    case 'BET_HOME':
      return { color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/30', label: 'HOME', icon: ArrowUp };
    case 'BET_AWAY':
      return { color: 'text-negative', bg: 'bg-negative/10', border: 'border-negative/30', label: 'AWAY', icon: ArrowDown };
    case 'BET_DRAW':
      return { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', label: 'DRAW', icon: Trophy };
    default:
      return { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', label: 'TBD', icon: Trophy };
  }
};

const PredictionRow = ({ prediction }) => {
  const config = getSignalConfig(prediction.recommendation);
  const Icon = config.icon;
  
  return (
    <div className={`flex items-center gap-4 p-3 rounded-lg border ${config.border} ${config.bg} hover:bg-white/5 transition-colors`}>
      <div className="flex-shrink-0 text-center w-16">
        <span className={`text-xs font-bold ${config.color}`}>{config.label}</span>
        <p className="text-[10px] text-gray-500">{prediction.confidence}%</p>
      </div>
      
      <div className="flex-1 flex items-center justify-between">
        <div className="flex-1">
          <p className="font-medium text-white text-sm truncate">{prediction.homeTeam}</p>
          <div className="flex gap-0.5 mt-1">
            {prediction.homeForm.split('').slice(0, 5).map((r, i) => (
              <span key={i} className={`w-4 h-4 rounded text-[8px] flex items-center justify-center font-bold ${
                r === 'W' ? 'bg-accent/20 text-accent' : r === 'D' ? 'bg-gray-500/20 text-gray-400' : 'bg-negative/20 text-negative'
              }`}>{r}</span>
            ))}
          </div>
        </div>
        
        <div className="px-3 text-center">
          <p className="text-xs text-gray-500 mb-1">{prediction.date}</p>
          <p className="text-lg font-bold text-white">VS</p>
        </div>
        
        <div className="flex-1 text-right">
          <p className="font-medium text-white text-sm truncate">{prediction.awayTeam}</p>
          <div className="flex gap-0.5 mt-1 justify-end">
            {prediction.awayForm.split('').slice(0, 5).map((r, i) => (
              <span key={i} className={`w-4 h-4 rounded text-[8px] flex items-center justify-center font-bold ${
                r === 'W' ? 'bg-negative/20 text-negative' : r === 'D' ? 'bg-gray-500/20 text-gray-400' : 'bg-accent/20 text-accent'
              }`}>{r}</span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex-shrink-0 flex gap-2">
        <div className="text-center w-12">
          <p className="text-xs text-gray-500">Home</p>
          <p className="font-mono text-sm text-accent">{prediction.homeProb}%</p>
        </div>
        <div className="text-center w-12">
          <p className="text-xs text-gray-500">Draw</p>
          <p className="font-mono text-sm text-yellow-400">{prediction.drawProb}%</p>
        </div>
        <div className="text-center w-12">
          <p className="text-xs text-gray-500">Away</p>
          <p className="font-mono text-sm text-negative">{prediction.awayProb}%</p>
        </div>
      </div>
    </div>
  );
};

const TeamSearch = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const { results, loading, search } = useTeamSearch();
  
  return (
    <div className="relative">
      <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
        <MagnifyingGlass size={14} className="text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); search(e.target.value); }}
          placeholder="Search team..."
          className="flex-1 bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none"
        />
      </div>
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-white/10 rounded-lg shadow-xl z-20 max-h-40 overflow-y-auto">
          {results.map(team => (
            <button
              key={team.idTeam}
              onClick={() => { onSelect(team); setQuery(''); search(''); }}
              className="w-full flex items-center gap-2 p-2 hover:bg-white/5 text-left"
            >
              <span className="text-xs text-white">{team.strTeam}</span>
              <span className="text-xs text-gray-500">{team.strLeague}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const SportsPredictions = () => {
  const [selectedLeague, setSelectedLeague] = useState(4328);
  const { upcoming, past, loading } = useSportsData(selectedLeague);
  const [predictions, setPredictions] = useState([]);
  
  useEffect(() => {
    if (upcoming.length > 0) {
      const preds = upcoming.slice(0, 10).map(match => {
        const prediction = generateMatchPrediction(match.strHomeTeam, match.strAwayTeam, past);
        return {
          ...prediction,
          date: match.dateEvent ? format(new Date(match.dateEvent), 'MMM dd') : 'TBD',
          time: match.strTime?.slice(0, 5) || '',
        };
      });
      setPredictions(preds);
    }
  }, [upcoming, past]);
  
  const homeWins = predictions.filter(p => p.recommendation === 'BET_HOME');
  const awayWins = predictions.filter(p => p.recommendation === 'BET_AWAY');
  const draws = predictions.filter(p => p.recommendation === 'BET_DRAW');

  return (
    <div className="glass-card p-5 widget-enter">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy size={20} className="text-blue-400" />
          <h3 className="font-display text-lg font-bold text-white">Match Predictions</h3>
        </div>
        <span className="live-badge">Live</span>
      </div>
      
      <div className="mb-4">
        <TeamSearch onSelect={(team) => console.log('Selected:', team)} />
      </div>
      
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {LEAGUES.map(league => (
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
      
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
              <div className="w-16 h-10 skeleton rounded" />
              <div className="flex-1 h-12 skeleton rounded" />
              <div className="w-36 h-10 skeleton rounded" />
            </div>
          ))
        ) : predictions.length > 0 ? (
          predictions.map((pred, i) => (
            <PredictionRow key={i} prediction={pred} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No upcoming matches
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" /> {homeWins.length} Home</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400" /> {draws.length} Draw</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-negative" /> {awayWins.length} Away</span>
        </div>
      </div>
    </div>
  );
};

export default SportsPredictions;
