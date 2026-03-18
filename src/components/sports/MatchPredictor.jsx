import { useSportsData, LEAGUE_IDS, useTeamForm } from '../../hooks/useSportsData';
import { calculateWinProbabilities } from '../../utils/predictions';
import { format, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MatchCard = ({ event }) => {
  const { form: homeForm } = useTeamForm(event.strHomeTeam);
  const { form: awayForm } = useTeamForm(event.strAwayTeam);

  const probabilities = calculateWinProbabilities(
    homeForm.length > 0 ? homeForm : ['W', 'D', 'W', 'L', 'W'],
    awayForm.length > 0 ? awayForm : ['W', 'L', 'W', 'W', 'D']
  );

  const chartData = [
    { name: 'Home', value: probabilities.home, fill: '#00ff9d' },
    { name: 'Draw', value: probabilities.draw, fill: '#6b6b7a' },
    { name: 'Away', value: probabilities.away, fill: '#3b82f6' },
  ];

  const matchDate = event.dateEvent ? format(parseISO(event.dateEvent), 'MMM dd') : 'TBD';
  const matchTime = event.strTime ? event.strTime.slice(0, 5) : '';

  return (
    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500">{event.strLeague}</span>
        <span className="text-xs text-gray-500 font-mono">
          {matchDate} {matchTime}
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-center flex-1">
          <div className="font-display font-bold text-white text-sm lg:text-base">
            {event.strHomeTeam}
          </div>
        </div>
        <div className="px-3 text-gray-500 text-sm font-mono">vs</div>
        <div className="text-center flex-1">
          <div className="font-display font-bold text-white text-sm lg:text-base">
            {event.strAwayTeam}
          </div>
        </div>
      </div>

      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip
              contentStyle={{
                backgroundColor: '#13131a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
              formatter={(value) => [`${value.toFixed(1)}%`, 'Win Probability']}
              labelStyle={{ color: '#8b8b9a' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between mt-2 text-xs font-mono">
        <span className="text-accent">{probabilities.home.toFixed(1)}%</span>
        <span className="text-gray-500">{probabilities.draw.toFixed(1)}%</span>
        <span className="text-blue-400">{probabilities.away.toFixed(1)}%</span>
      </div>
    </div>
  );
};

const MatchPredictor = () => {
  const { upcomingEvents, loading } = useSportsData(LEAGUE_IDS.EPL);

  return (
    <div className="glass-card p-5 widget-enter">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold text-white">
          Match Predictor
        </h3>
        <span className="live-badge">AI Prediction</span>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 bg-white/5 rounded-xl">
              <div className="flex justify-between mb-3">
                <div className="w-20 h-3 skeleton rounded" />
                <div className="w-16 h-3 skeleton rounded" />
              </div>
              <div className="flex justify-between mb-4">
                <div className="w-24 h-5 skeleton rounded" />
                <div className="w-8 h-5 skeleton rounded" />
                <div className="w-24 h-5 skeleton rounded" />
              </div>
              <div className="h-20 skeleton rounded" />
            </div>
          ))
        ) : upcomingEvents.length > 0 ? (
          upcomingEvents.slice(0, 4).map((event) => (
            <MatchCard key={event.idEvent} event={event} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No upcoming matches
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-xs text-gray-500 text-center">
          Based on last 5 games form (W=3pts, D=1pt)
        </p>
      </div>
    </div>
  );
};

export default MatchPredictor;
