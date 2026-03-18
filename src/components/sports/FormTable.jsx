import { useSportsData, LEAGUES, generateMatchPrediction } from '../../hooks/useSportsData';
import { Trophy, ArrowUp, ArrowDown } from '@phosphor-icons/react';

const FormDot = ({ result }) => {
  const colors = {
    W: { bg: 'bg-accent', text: 'text-accent' },
    D: { bg: 'bg-gray-500', text: 'text-gray-400' },
    L: { bg: 'bg-negative', text: 'text-negative' },
  };
  const c = colors[result] || colors.D;
  return (
    <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${c.bg} ${c.text}`}>
      {result}
    </div>
  );
};

const FormTable = () => {
  const [selectedLeague, setSelectedLeague] = useState(4328);
  const { upcoming, past, loading } = useSportsData(selectedLeague);
  
  const teamsWithForm = useMemo(() => {
    const teamMap = new Map();
    
    past.forEach(match => {
      if (!match.intHomeScore || !match.intAwayScore) return;
      
      const homeScore = parseInt(match.intHomeScore);
      const awayScore = parseInt(match.intAwayScore);
      const homeResult = homeScore > awayScore ? 'W' : homeScore === awayScore ? 'D' : 'L';
      const awayResult = homeScore > awayScore ? 'L' : homeScore === awayScore ? 'D' : 'W';
      
      if (!teamMap.has(match.strHomeTeam)) {
        teamMap.set(match.strHomeTeam, { form: [], played: 0, won: 0, drawn: 0, lost: 0, pts: 0 });
      }
      const homeTeam = teamMap.get(match.strHomeTeam);
      homeTeam.form.unshift(homeResult);
      homeTeam.form = homeTeam.form.slice(0, 5);
      homeTeam.played++;
      if (homeResult === 'W') { homeTeam.won++; homeTeam.pts += 3; }
      else if (homeResult === 'D') { homeTeam.drawn++; homeTeam.pts += 1; }
      else homeTeam.lost++;
      
      if (!teamMap.has(match.strAwayTeam)) {
        teamMap.set(match.strAwayTeam, { form: [], played: 0, won: 0, drawn: 0, lost: 0, pts: 0 });
      }
      const awayTeam = teamMap.get(match.strAwayTeam);
      awayTeam.form.unshift(awayResult);
      awayTeam.form = awayTeam.form.slice(0, 5);
      awayTeam.played++;
      if (awayResult === 'W') { awayTeam.won++; awayTeam.pts += 3; }
      else if (awayResult === 'D') { awayTeam.drawn++; awayTeam.pts += 1; }
      else awayTeam.lost++;
    });
    
    return Array.from(teamMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.pts - a.pts || (b.won - b.drawn) - (a.won - a.drawn))
      .slice(0, 12);
  }, [past]);

  return (
    <div className="glass-card p-5 widget-enter">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy size={20} className="text-blue-400" />
          <h3 className="font-display text-lg font-bold text-white">League Table</h3>
        </div>
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
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-2 px-2 text-left text-xs font-bold text-gray-500">#</th>
              <th className="py-2 px-2 text-left text-xs font-bold text-gray-500">Team</th>
              <th className="py-2 px-2 text-center text-xs font-bold text-gray-500">Form</th>
              <th className="py-2 px-2 text-center text-xs font-bold text-gray-500">P</th>
              <th className="py-2 px-2 text-center text-xs font-bold text-gray-500">Pts</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="py-2 px-2"><div className="w-6 h-4 skeleton rounded" /></td>
                  <td className="py-2 px-2"><div className="w-24 h-4 skeleton rounded" /></td>
                  <td className="py-2 px-2"><div className="w-20 h-5 skeleton rounded" /></td>
                  <td className="py-2 px-2"><div className="w-6 h-4 skeleton rounded" /></td>
                  <td className="py-2 px-2"><div className="w-8 h-4 skeleton rounded" /></td>
                </tr>
              ))
            ) : teamsWithForm.length > 0 ? (
              teamsWithForm.map((team, i) => (
                <tr key={team.name} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-2 px-2 font-mono text-gray-400">{i + 1}</td>
                  <td className="py-2 px-2 font-medium text-white truncate max-w-[120px]">{team.name}</td>
                  <td className="py-2 px-2">
                    <div className="flex gap-0.5 justify-center">
                      {team.form.slice(0, 5).map((r, j) => <FormDot key={j} result={r} />)}
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center font-mono text-gray-400">{team.played}</td>
                  <td className="py-2 px-2 text-center font-mono font-bold text-accent">{team.pts}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FormTable;
