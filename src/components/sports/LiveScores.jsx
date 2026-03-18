import { Trophy, Calendar, Clock } from '@phosphor-icons/react';
import { format } from 'date-fns';
import { useSportsData } from '../../hooks/useSportsData';

const LiveScores = () => {
  const { past, loading } = useSportsData(4328);
  
  return (
    <div className="glass-card p-5 widget-enter">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy size={20} className="text-blue-400" />
          <h3 className="font-display text-lg font-bold text-white">Recent Results</h3>
        </div>
        <span className="text-xs text-gray-500">Today</span>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 bg-white/5 rounded-xl">
              <div className="flex justify-between mb-2">
                <div className="w-20 h-3 skeleton rounded" />
                <div className="w-16 h-3 skeleton rounded" />
              </div>
              <div className="flex justify-between items-center">
                <div className="w-24 h-5 skeleton rounded" />
                <div className="flex gap-2">
                  <div className="w-10 h-6 skeleton rounded" />
                  <div className="w-10 h-6 skeleton rounded" />
                </div>
                <div className="w-24 h-5 skeleton rounded" />
              </div>
            </div>
          ))
        ) : past.length > 0 ? (
          past.slice(0, 8).map((match) => {
            const isFinished = match.intHomeScore && match.intAwayScore;
            return (
              <div 
                key={match.idEvent}
                className="p-4 bg-white/5 rounded-xl border border-white/5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={12} />
                    {match.dateEvent ? format(new Date(match.dateEvent), 'MMM dd') : ''}
                  </span>
                  {isFinished && (
                    <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-full">
                      Final
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="font-medium text-white text-sm block truncate">
                      {match.strHomeTeam}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 px-4">
                    {isFinished ? (
                      <>
                        <span className="font-mono text-lg font-bold text-white">
                          {match.intHomeScore}
                        </span>
                        <span className="text-gray-500">-</span>
                        <span className="font-mono text-lg font-bold text-white">
                          {match.intAwayScore}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-blue-400 font-mono">Upcoming</span>
                    )}
                  </div>
                  
                  <div className="flex-1 text-right">
                    <span className="font-medium text-white text-sm block truncate">
                      {match.strAwayTeam}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            No recent matches
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <p className="text-xs text-gray-500">Multiple leagues</p>
      </div>
    </div>
  );
};

export default LiveScores;
