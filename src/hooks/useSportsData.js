import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const SPORTS_DB_KEY = '3';
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${SPORTS_DB_KEY}`;

const LEAGUES = [
  { id: 4328, name: 'Premier League', country: 'England' },
  { id: 4334, name: 'La Liga', country: 'Spain' },
  { id: 4331, name: 'Bundesliga', country: 'Germany' },
  { id: 4332, name: 'Serie A', country: 'Italy' },
  { id: 4335, name: 'Ligue 1', country: 'France' },
  { id: 4387, name: 'NBA', country: 'USA' },
];

const MOCK_UPCOMING = [
  { idEvent: '1', strHomeTeam: 'Man City', strAwayTeam: 'Liverpool', strLeague: 'Premier League', dateEvent: '2026-03-22', strTime: '17:30', strHomeTeamBadge: '', strAwayTeamBadge: '' },
  { idEvent: '2', strHomeTeam: 'Arsenal', strAwayTeam: 'Chelsea', strLeague: 'Premier League', dateEvent: '2026-03-23', strTime: '16:00', strHomeTeamBadge: '', strAwayTeamBadge: '' },
  { idEvent: '3', strHomeTeam: 'Real Madrid', strAwayTeam: 'Barcelona', strLeague: 'La Liga', dateEvent: '2026-03-23', strTime: '20:00', strHomeTeamBadge: '', strAwayTeamBadge: '' },
  { idEvent: '4', strHomeTeam: 'Bayern Munich', strAwayTeam: 'Dortmund', strLeague: 'Bundesliga', dateEvent: '2026-03-22', strTime: '17:30', strHomeTeamBadge: '', strAwayTeamBadge: '' },
];

const MOCK_PAST = [
  { idEvent: '101', strHomeTeam: 'Man United', strAwayTeam: 'Tottenham', strLeague: 'Premier League', dateEvent: '2026-03-18', intHomeScore: '2', intAwayScore: '1' },
  { idEvent: '102', strHomeTeam: 'PSG', strAwayTeam: 'Marseille', strLeague: 'Ligue 1', dateEvent: '2026-03-17', intHomeScore: '3', intAwayScore: '0' },
  { idEvent: '103', strHomeTeam: 'Lakers', strAwayTeam: 'Celtics', strLeague: 'NBA', dateEvent: '2026-03-18', intHomeScore: '118', intAwayScore: '112' },
];

const MOCK_FORMS = {
  'Man City': 'WWWWD',
  'Liverpool': 'WWWDW',
  'Arsenal': 'WDWWW',
  'Chelsea': 'LLDLW',
  'Tottenham': 'WLWDL',
  'Man United': 'WLDWW',
  'Real Madrid': 'WWWWW',
  'Barcelona': 'WDWWW',
  'Bayern Munich': 'WWWDW',
  'Dortmund': 'WLWDL',
};

const fetchFromAPI = async (endpoint, params = {}) => {
  try {
    const res = await axios.get(`${BASE_URL}/${endpoint}`, { params });
    return res.data;
  } catch (e) {
    console.warn(`API error: ${endpoint}`, e.message);
    return null;
  }
};

export const fetchUpcomingMatches = async (leagueId = 4328) => {
  const data = await fetchFromAPI('eventsnextleague.php', { id: leagueId });
  if (data?.events) return data.events.slice(0, 10);
  return MOCK_UPCOMING;
};

export const fetchPastMatches = async (leagueId = 4328) => {
  const data = await fetchFromAPI('eventspastleague.php', { id: leagueId });
  if (data?.events) return data.events.slice(0, 10);
  return MOCK_PAST;
};

export const fetchLeagueTeams = async (leagueId = 4328) => {
  const data = await fetchFromAPI('lookup_all_teams.php', { id: leagueId });
  return data?.teams || [];
};

export const searchTeams = async (query) => {
  if (!query || query.length < 2) return [];
  const data = await fetchFromAPI('searchteams.php', { t: query });
  return data?.teams || [];
};

export const fetchTeamDetails = async (teamId) => {
  const data = await fetchFromAPI('lookupteam.php', { id: teamId });
  return data?.teams?.[0] || null;
};

export const fetchTeamLastMatches = async (teamId) => {
  const data = await fetchFromAPI('eventslast.php', { teamId });
  return data?.results || [];
};

export const generateMatchPrediction = (homeTeam, awayTeam) => {
  const homeForm = MOCK_FORMS[homeTeam] || 'DLWLW';
  const awayForm = MOCK_FORMS[awayTeam] || 'DLWLW';
  
  const formScore = (form) => {
    return form.split('').reduce((acc, r) => {
      if (r === 'W') return acc + 3;
      if (r === 'D') return acc + 1;
      return acc;
    }, 0);
  };
  
  const homeScore = formScore(homeForm);
  const awayScore = formScore(awayForm);
  const total = homeScore + awayScore + 1;
  
  let homeProb = (homeScore / total) * 100;
  let awayProb = (awayScore / total) * 100;
  let drawProb = 100 - homeProb - awayProb;
  
  homeProb = Math.max(20, Math.min(70, homeProb + 15));
  awayProb = Math.max(15, Math.min(60, awayProb + 10));
  drawProb = Math.max(10, 100 - homeProb - awayProb);
  
  const sum = homeProb + awayProb + drawProb;
  homeProb = (homeProb / sum) * 100;
  awayProb = (awayProb / sum) * 100;
  drawProb = (drawProb / sum) * 100;
  
  let recommendation = 'BET_DRAW';
  let confidence = 50;
  
  if (homeProb > awayProb + 15) {
    recommendation = 'BET_HOME';
    confidence = Math.min(85, 60 + (homeProb - awayProb) / 2);
  } else if (awayProb > homeProb + 15) {
    recommendation = 'BET_AWAY';
    confidence = Math.min(85, 60 + (awayProb - homeProb) / 2);
  } else if (drawProb > 30) {
    recommendation = 'BET_DRAW';
    confidence = 55 + drawProb / 3;
  }
  
  const recentForm = homeScore > awayScore ? homeForm : awayForm;
  const streak = recentForm.match(/W{2,}|L{2,}/)?.[0] || '';
  
  return {
    homeTeam,
    awayTeam,
    homeProb: homeProb.toFixed(1),
    awayProb: awayProb.toFixed(1),
    drawProb: drawProb.toFixed(1),
    recommendation,
    confidence: Math.round(confidence),
    homeForm,
    awayForm,
    streak: streak.length > 0 ? `${streak.length} ${streak[0] === 'W' ? 'wins' : 'losses'} in a row` : 'Inconsistent',
    keyFactor: homeScore > awayScore ? 'Better form' : 'Home advantage',
  };
};

export const useSportsData = (leagueId = 4328) => {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [up, pa] = await Promise.all([
      fetchUpcomingMatches(leagueId),
      fetchPastMatches(leagueId),
    ]);
    setUpcoming(up);
    setPast(pa);
    setLoading(false);
  }, [leagueId]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { upcoming, past, loading, refetch: fetchData };
};

export const useTeamSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const teams = await searchTeams(query);
    setResults(teams.slice(0, 8));
    setLoading(false);
  }, []);

  return { results, loading, search };
};

export { LEAGUES, MOCK_FORMS };
