import { useState, useEffect } from 'react';
import { Bell, X, Newspaper, ChartLine, Warning } from '@phosphor-icons/react';
import useDashboardStore from '../../store/dashboardStore';

const AlertItem = ({ alert, onDismiss }) => {
  const getIcon = () => {
    switch (alert.type) {
      case 'news': return <Newspaper size={16} className="text-accent" />;
      case 'price': return <ChartLine size={16} className="text-yellow-400" />;
      case 'warning': return <Warning size={16} className="text-negative" />;
      default: return <Bell size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-card border border-white/10 rounded-lg hover:bg-white/5 transition-colors animate-slide-up">
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{alert.title}</p>
        <p className="text-xs text-gray-400 truncate">{alert.message}</p>
        {alert.symbol && (
          <span className="inline-block mt-1 px-1.5 py-0.5 text-xs bg-accent/10 text-accent rounded">
            {alert.symbol}
          </span>
        )}
      </div>
      <button 
        onClick={() => onDismiss(alert.id)}
        className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
      >
        <X size={14} className="text-gray-500" />
      </button>
    </div>
  );
};

const AlertPanel = () => {
  const { newsAlerts, dismissAlert, clearAlerts } = useDashboardStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
      >
        <Bell size={20} className="text-gray-400" />
        {newsAlerts.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-negative text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {newsAlerts.length > 9 ? '9+' : newsAlerts.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 max-h-96 bg-card border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <h3 className="font-display font-bold text-white">Alerts</h3>
              {newsAlerts.length > 0 && (
                <button 
                  onClick={clearAlerts}
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
            
            <div className="max-h-72 overflow-y-auto p-2 space-y-2">
              {newsAlerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell size={24} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No alerts</p>
                </div>
              ) : (
                newsAlerts.map((alert) => (
                  <AlertItem 
                    key={alert.id} 
                    alert={alert} 
                    onDismiss={dismissAlert} 
                  />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AlertPanel;
