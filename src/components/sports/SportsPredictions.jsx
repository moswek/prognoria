import { useState, useEffect } from 'react';
import { Trophy, ArrowUp, ArrowDown, Clock, MagnifyingGlass, Calendar } from '@phosphor-icons/react';
import { format } from 'date-fns';
import { useSportsData, useTeamSearch, generateMatchPrediction, LEAGUES, MOCK_FORMS } from '../../hooks/useSportsData';
import useDashboardStore from '../../store/dashboardStore';

const getSignalConfig = (recommendation) => {
  switch (recommendation) {
    case 'BET_HOME':
      return { color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/30', label: 'HOME WIN' };
    case 'BET_AWAY':
      return { color: 'text-negative', bg: 'bg-negative/10', border: 'border-negative/30', label: 'AWAY WIN' };
    case 'BET_DRAW':
      return { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', label: 'DRAW' };
    default:
      return { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', label: 'UNSURE' };
  }
};

const MatchCard = ({ prediction, onClick }) => {
  const config = getSignalConfig(prediction.recommendation);
  
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-xl border ${config.border} ${config.bg} hover:scale-[1.01] transition-all cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar size={12} />
          <span>{prediction.date}</span>
          <span className="text-gray-600">|</span>
          <span>{prediction.time}</span>
        </div>
        <span className={`px-2 py-0.5 text-xs font-bold rounded ${config.bg} ${config.color}`}>
          {config.label}
        </span>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 text-center">
          <p className="font-display font-bold text-white text-sm">{prediction.homeTeam}</p>
          <p className="text-xs text-gray-500">{prediction.homeForm}</p>
        </div>
        <div className="px-3 text-gray-500 text-xs font-mono">VS</div>
        <div className="flex-1 text-center">
          <p className="font-display font-bold text-white text-sm">{prediction.awayTeam}</p>
          <p className="text-xs text-gray-500">{prediction.awayForm}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1">
          <div className="h-2 bg-black/30 rounded-full overflow-hidden">
            <div className="h-full bg-accent" style={{ width: `${prediction.homeProb}%` }} />
          </div>
          <p className="text-xs text-center mt-1 text-accent">{prediction.homeProb}%</p>
        </div>
        <div className="flex-1">
          <div className="h-2 bg-black/30 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400" style={{ width: `${prediction.drawProb}%` }} />
          </div>
          <p className="text-xs text-center mt-1 text-yellow-400">{prediction.drawProb}%</p>
        </div>
        <div className="flex-1">
          <div className="h-2 bg-black/30 rounded-full overflow-hidden">
            <div className="h-full bg-negative" style={{ width: `${prediction.awayProb}%` }} />
          </div>
          <p className="text-xs text-center mt-1 text-negative">{prediction.awayProb}%</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">
          <span className="text-accent">{prediction.confidence}%</span> confidence
        </span>
        <span className="text-gray-400">{prediction.keyFactor}</span>
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
        <MagnifyingGlass size={16} className="text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); search(e.target.value); }}
          placeholder="Search team..."
          className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
        />
      </div>
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-white/10 rounded-lg shadow-xl z-20 max-h-48 overflow-y-auto">
          {results.map(team => (
            <button
              key={team.idTeam}
              onClick={() => { onSelect(team); setQuery(''); search(''); }}
              className="w-full flex items-center gap-3 p-3 hover:bg-white/5 text-left"
            >
              {team.strTeamBadge && (
                <img src={team.strTeamBadge} alt="" className="w-6 h-6" />
              )}
              <div>
                <p className="text-sm text-white font-medium">{team.strTeam}</p>
                <p className="text-xs text-gray-500">{team.strLeague}</p>
              </div>
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
  const { addAlert } = useDashboardStore();
  
  useEffect(() => {
    if (upcoming.length > 0) {
      const preds = upcoming.slice(0, 8).map(match => {
        const prediction = generateMatchPrediction(match.strHomeTeam, match.strAwayTeam);
        return {
          ...prediction,
          date: match.dateEvent ? format(new Date(match.dateEvent), 'MMM dd') : 'TBD',
          time: match.strTime?.slice(0, 5) || 'TBD',
        };
      });
      setPredictions(preds);
    }
  }, [upcoming]);
  
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
            {league.name}
          </button>
        ))}
      </div>
      
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 bg-white/5 rounded-xl">
              <div className="flex justify-between mb-3">
                <div className="w-24 h-4 skeleton rounded" />
                <div className="w-16 h-6 skeleton rounded" />
              </div>
              <div className="flex justify-between mb-3">
                <div className="w-20 h-6 skeleton rounded" />
                <div className="w-12 h-6 skeleton rounded" />
                <div className="w-20 h-6 skeleton rounded" />
              </div>
              <div className="h-2 skeleton rounded" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {homeWins.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-accent mb-2 flex items-center gap-1">
                <ArrowUp size={12} /> HOME WINS ({homeWins.length})
              </p>
              <div className="space-y-2">
                {homeWins.map((pred, i) => (
                  <MatchCard key={i} prediction={pred} />
                ))}
              </div>
            </div>
          )}
          
          {draws.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-yellow-400 mb-2">DRAW LIKELY ({draws.length})</p>
              <div className="space-y-2">
                {draws.map((pred, i) => (
                  <MatchCard key={i} prediction={pred} />
                ))}
              </div>
            </div>
          )}
          
          {awayWins.length > 0 && (
            <div>
              <p className="text-xs font-bold text-negative mb-2 flex items-center gap-1">
                <ArrowDown size={12} /> AWAY WINS ({awayWins.length})
              </p>
              <div className="space-y-2">
                {awayWins.map((pred, i) => (
                  <MatchCard key={i} prediction={pred} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
      
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{predictions.length} matches tracked</span>
        </div>
      </div>
    </div>
  );
};

export default SportsPredictions;
