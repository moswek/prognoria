import { useState, useEffect } from 'react';
import { ChartLine, Trophy, Gear } from '@phosphor-icons/react';
import { format } from 'date-fns';
import useDashboardStore from '../../store/dashboardStore';
import AlertPanel from './AlertPanel';

const TopBar = () => {
  const [time, setTime] = useState(new Date());
  const { sectors, getActiveWidgetCount } = useDashboardStore();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeSectors = Object.entries(sectors)
    .filter(([_, active]) => active)
    .map(([sector]) => sector);

  return (
    <header className="h-16 bg-card border-b border-white/5 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="font-display text-2xl font-bold tracking-wider">
          <span className="relative">
            <span className="text-white">PROGN</span>
            <span className="text-accent relative z-10">ORIA</span>
            <span className="absolute -inset-1 bg-accent/20 blur-lg rounded-full -z-0" />
          </span>
        </h1>
        <div className="h-6 w-px bg-white/10" />
        <div className="flex items-center gap-2">
          {sectors.finance && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-accent/10 rounded-full text-xs font-medium text-accent">
              <ChartLine size={12} weight="fill" />
              Finance
            </span>
          )}
          {sectors.sports && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 rounded-full text-xs font-medium text-blue-400">
              <Trophy size={12} weight="fill" />
              Sports
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/5">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-sm text-gray-300">
            {format(time, "yyyy-MM-dd HH:mm:ss")} UTC
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
          <span className="text-xs text-gray-500">Active Widgets:</span>
          <span className="font-mono text-sm font-bold text-accent">
            {getActiveWidgetCount()}
          </span>
        </div>

        <AlertPanel />

        <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
          <Gear size={20} className="text-gray-400" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
