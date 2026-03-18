import { useSportsData, LEAGUE_IDS } from '../../hooks/useSportsData';
import { useTeamForm } from '../../hooks/useSportsData';
import { getSignalColor } from '../../utils/predictions';

const FormDot = ({ result }) => {
  const color = getSignalColor(result);
  return (
    <div
      className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {result}
    </div>
  );
};

const TeamRow = ({ teamName, position, played, won, drawn, lost, points }) => {
  const { form } = useTeamForm(teamName);

  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="py-3 px-2 text-center font-mono text-gray-400 text-sm">
        {position}
      </td>
      <td className="py-3 px-2">
        <span className="font-medium text-white text-sm">{teamName}</span>
      </td>
      <td className="py-3 px-2">
        <div className="flex gap-1">
          {form.length > 0 ? (
            form.map((result, i) => <FormDot key={i} result={result} />)
          ) : (
            <>
              <FormDot result="W" />
              <FormDot result="D" />
              <FormDot result="W" />
              <FormDot result="L" />
              <FormDot result="W" />
            </>
          )}
        </div>
      </td>
      <td className="py-3 px-2 text-right font-mono text-gray-400 text-sm">
        {played}
      </td>
      <td className="py-3 px-2 text-right font-mono text-gray-400 text-sm">
        {won}
      </td>
      <td className="py-3 px-2 text-right font-mono text-gray-400 text-sm">
        {drawn}
      </td>
      <td className="py-3 px-2 text-right font-mono text-gray-400 text-sm">
        {lost}
      </td>
      <td className="py-3 px-2 text-right font-mono font-bold text-accent text-sm">
        {points}
      </td>
    </tr>
  );
};

const FormTable = () => {
  const { pastEvents, loading } = useSportsData(LEAGUE_IDS.EPL);

  const mockStandings = [
    { team: 'Manchester City', position: 1, played: 28, won: 20, drawn: 4, lost: 4, points: 64 },
    { team: 'Liverpool', position: 2, played: 28, won: 19, drawn: 6, lost: 3, points: 63 },
    { team: 'Arsenal', position: 3, played: 28, won: 18, drawn: 5, lost: 5, points: 59 },
    { team: 'Aston Villa', position: 4, played: 28, won: 16, drawn: 5, lost: 7, points: 53 },
    { team: 'Tottenham', position: 5, played: 28, won: 14, drawn: 5, lost: 9, points: 47 },
    { team: 'Manchester United', position: 6, played: 28, won: 13, drawn: 5, lost: 10, points: 44 },
  ];

  return (
    <div className="glass-card p-5 widget-enter">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold text-white">
          Form Table
        </h3>
        <span className="text-xs text-gray-500">Premier League</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                #
              </th>
              <th className="py-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">
                Team
              </th>
              <th className="py-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">
                Form
              </th>
              <th className="py-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                P
              </th>
              <th className="py-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                W
              </th>
              <th className="py-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                D
              </th>
              <th className="py-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                L
              </th>
              <th className="py-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                Pts
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="py-3 px-2"><div className="w-6 h-4 skeleton rounded mx-auto" /></td>
                  <td className="py-3 px-2"><div className="w-24 h-4 skeleton rounded" /></td>
                  <td className="py-3 px-2"><div className="w-28 h-6 skeleton rounded" /></td>
                  <td className="py-3 px-2"><div className="w-6 h-4 skeleton rounded ml-auto" /></td>
                  <td className="py-3 px-2"><div className="w-6 h-4 skeleton rounded ml-auto" /></td>
                  <td className="py-3 px-2"><div className="w-6 h-4 skeleton rounded ml-auto" /></td>
                  <td className="py-3 px-2"><div className="w-6 h-4 skeleton rounded ml-auto" /></td>
                  <td className="py-3 px-2"><div className="w-8 h-4 skeleton rounded ml-auto" /></td>
                </tr>
              ))
            ) : (
              mockStandings.map((team) => (
                <TeamRow key={team.team} {...team} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-accent" /> Win
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-500" /> Draw
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-negative" /> Loss
          </span>
        </div>
      </div>
    </div>
  );
};

export default FormTable;
