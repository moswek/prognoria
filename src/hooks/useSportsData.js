import { useState, useEffect, useCallback } from 'react';
import {
  fetchUpcomingEvents,
  fetchPastEvents,
  fetchLiveScores,
  fetchTeamForm,
  LEAGUE_IDS,
} from '../services/sportsDB';

const MOCK_UPCOMING_EVENTS = [
  {
    idEvent: '1',
    strEvent: 'Manchester United vs Liverpool',
    strHomeTeam: 'Manchester United',
    strAwayTeam: 'Liverpool',
    strLeague: 'Premier League',
    dateEvent: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    strTime: '15:00:00',
    strThumb: null,
  },
  {
    idEvent: '2',
    strEvent: 'Arsenal vs Chelsea',
    strHomeTeam: 'Arsenal',
    strAwayTeam: 'Chelsea',
    strLeague: 'Premier League',
    dateEvent: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    strTime: '17:30:00',
    strThumb: null,
  },
  {
    idEvent: '3',
    strEvent: 'Tottenham vs Newcastle',
    strHomeTeam: 'Tottenham',
    strAwayTeam: 'Newcastle',
    strLeague: 'Premier League',
    dateEvent: new Date(Date.now() + 259200000).toISOString().split('T')[0],
    strTime: '14:00:00',
    strThumb: null,
  },
  {
    idEvent: '4',
    strEvent: 'LA Lakers vs Boston Celtics',
    strHomeTeam: 'LA Lakers',
    strAwayTeam: 'Boston Celtics',
    strLeague: 'NBA',
    dateEvent: new Date(Date.now() + 43200000).toISOString().split('T')[0],
    strTime: '21:30:00',
    strThumb: null,
  },
  {
    idEvent: '5',
    strEvent: 'GS Warriors vs Phoenix Suns',
    strHomeTeam: 'GS Warriors',
    strAwayTeam: 'Phoenix Suns',
    strLeague: 'NBA',
    dateEvent: new Date(Date.now() + 129600000).toISOString().split('T')[0],
    strTime: '22:00:00',
    strThumb: null,
  },
];

const MOCK_PAST_EVENTS = [
  {
    idEvent: '101',
    strEvent: 'Manchester City vs Aston Villa',
    strHomeTeam: 'Manchester City',
    strAwayTeam: 'Aston Villa',
    strLeague: 'Premier League',
    dateEvent: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    intHomeScore: '3',
    intAwayScore: '1',
    strThumb: null,
  },
  {
    idEvent: '102',
    strEvent: 'Chelsea vs Tottenham',
    strHomeTeam: 'Chelsea',
    strAwayTeam: 'Tottenham',
    strLeague: 'Premier League',
    dateEvent: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    intHomeScore: '2',
    intAwayScore: '2',
    strThumb: null,
  },
  {
    idEvent: '103',
    strEvent: 'Miami Heat vs NY Knicks',
    strHomeTeam: 'Miami Heat',
    strAwayTeam: 'NY Knicks',
    strLeague: 'NBA',
    dateEvent: new Date(Date.now() - 43200000).toISOString().split('T')[0],
    intHomeScore: '118',
    intAwayScore: '112',
    strThumb: null,
  },
  {
    idEvent: '104',
    strEvent: 'Liverpool vs Everton',
    strHomeTeam: 'Liverpool',
    strAwayTeam: 'Everton',
    strLeague: 'Premier League',
    dateEvent: new Date(Date.now() - 259200000).toISOString().split('T')[0],
    intHomeScore: '2',
    intAwayScore: '0',
    strThumb: null,
  },
];

const MOCK_TEAM_FORMS = {
  'Manchester United': 'WDLWW',
  'Liverpool': 'WWWDW',
  'Arsenal': 'WDWWW',
  'Chelsea': 'LLDLW',
  'Tottenham': 'WLWDL',
  'Newcastle': 'DWWLW',
  'LA Lakers': 'WLWWW',
  'Boston Celtics': 'WWLWW',
  'GS Warriors': 'LWWLW',
  'Phoenix Suns': 'WLLWW',
  'Manchester City': 'WWWWW',
  'Aston Villa': 'DLWDW',
  'Everton': 'LLDLL',
  'Miami Heat': 'WLWWL',
  'NY Knicks': 'LWWLW',
};

export const useSportsData = (leagueId = LEAGUE_IDS.EPL, autoRefresh = false) => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [upcoming, past] = await Promise.all([
        fetchUpcomingEvents(leagueId),
        fetchPastEvents(leagueId),
      ]);

      setUpcomingEvents(upcoming.length > 0 ? upcoming.slice(0, 5) : MOCK_UPCOMING_EVENTS);
      setPastEvents(past.length > 0 ? past.slice(0, 5) : MOCK_PAST_EVENTS);
    } catch (err) {
      console.warn('Using mock sports data:', err.message);
      setUpcomingEvents(MOCK_UPCOMING_EVENTS);
      setPastEvents(MOCK_PAST_EVENTS);
    } finally {
      setLoading(false);
    }
  }, [leagueId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchData, 300000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchData]);

  return { upcomingEvents, pastEvents, loading, error, refetch: fetchData };
};

export const useLiveScores = () => {
  const [liveEvents, setLiveEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLive = async () => {
      setLoading(true);
      try {
        const live = await fetchLiveScores();
        setLiveEvents(live.slice(0, 10));
      } catch {
        setLiveEvents(MOCK_PAST_EVENTS.filter(e => e.intHomeScore));
      } finally {
        setLoading(false);
      }
    };

    fetchLive();
    const interval = setInterval(fetchLive, 60000);
    return () => clearInterval(interval);
  }, []);

  return { liveEvents, loading };
};

export const useTeamForm = (teamName) => {
  const [form, setForm] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!teamName) {
      setForm([]);
      return;
    }

    const mockForm = MOCK_TEAM_FORMS[teamName] || 'DLWLW';
    setForm(mockForm.split(''));
  }, [teamName]);

  return { form, loading };
};

export { LEAGUE_IDS };
