import { useLiveScores } from '../../hooks/useSportsData';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock } from '@phosphor-icons/react';

const LiveScores = () => {
  const { liveEvents, loading } = useLiveScores();

  return (
    <div className="glass-card p-5 widget-enter">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold text-white">
          Live Scores
        </h3>
        <span className="live-badge">Today</span>
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
                <div className="w-28 h-5 skeleton rounded" />
                <div className="flex gap-2">
                  <div className="w-10 h-6 skeleton rounded" />
                  <div className="w-10 h-6 skeleton rounded" />
                </div>
                <div className="w-28 h-5 skeleton rounded" />
              </div>
            </div>
          ))
        ) : liveEvents.length > 0 ? (
          liveEvents.map((event) => {
            const isFinished = event.intHomeScore && event.intAwayScore;
            const matchDate = event.dateEvent
              ? format(parseISO(event.dateEvent), 'MMM dd')
              : '';
            
            return (
              <div
                key={event.idEvent || event.strEvent}
                className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={12} />
                    {event.strLeague}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    {matchDate}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="font-medium text-white text-sm block truncate">
                      {event.strHomeTeam}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 px-4">
                    {isFinished ? (
                      <>
                        <span className="font-mono text-lg font-bold text-white">
                          {event.intHomeScore}
                        </span>
                        <span className="text-gray-500">-</span>
                        <span className="font-mono text-lg font-bold text-white">
                          {event.intAwayScore}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-accent font-mono">Upcoming</span>
                    )}
                  </div>

                  <div className="flex-1 text-right">
                    <span className="font-medium text-white text-sm block truncate">
                      {event.strAwayTeam}
                    </span>
                  </div>
                </div>

                {isFinished && (
                  <div className="mt-2 text-center">
                    <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full">
                      Final
                    </span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            No live matches at the moment
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <p className="text-xs text-gray-500">Results from multiple leagues</p>
        <button className="text-xs text-accent hover:underline">
          View All
        </button>
      </div>
    </div>
  );
};

export default LiveScores;
