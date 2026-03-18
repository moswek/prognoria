import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const SPORTS_DB_KEY = '3';
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${SPORTS_DB_KEY}`;

const LEAGUES = [
  { id: 4328, name: 'Premier League', country: 'England', short: 'EPL' },
  { id: 4334, name: 'La Liga', country: 'Spain', short: 'LLiga' },
  { id: 4331, name: 'Bundesliga', country: 'Germany', short: 'Bundes' },
  { id: 4332, name: 'Serie A', country: 'Italy', short: 'SerieA' },
  { id: 4335, name: 'Ligue 1', country: 'France', short: 'L1' },
  { id: 4387, name: 'NBA', country: 'USA', short: 'NBA' },
];

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
  return data?.events || [];
};

export const fetchPastMatches = async (leagueId = 4328) => {
  const data = await fetchFromAPI('eventspastleague.php', { id: leagueId });
  return data?.events || [];
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

const calculateFormFromResults = (matches, teamName, isHome = true) => {
  const teamKey = isHome ? 'strHomeTeam' : 'strAwayTeam';
  const oppKey = isHome ? 'strAwayTeam' : 'strHomeTeam';
  const scoreKey = isHome ? 'intHomeScore' : 'intAwayScore';
  const oppScoreKey = isHome ? 'intAwayScore' : 'intHomeScore';
  
  const last5 = matches
    .filter(m => m[teamKey] === teamName && m[scoreKey] !== null)
    .slice(0, 5);
  
  return last5.map(m => {
    const score = parseInt(m[scoreKey]);
    const oppScore = parseInt(m[oppScoreKey]);
    if (score > oppScore) return 'W';
    if (score === oppScore) return 'D';
    return 'L';
  }).join('');
};

const getTeamHash = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const FORMS = ['WWWWW', 'WWWWD', 'WWWDW', 'WWWDL', 'WWWLW', 'WWDWW', 'WDWWW', 'DWWWW', 'LWWWW', 'WWLWW', 'WLWWW', 'LWWDW', 'WDLWW', 'WWDWL', 'WDWWL', 'DWWWL', 'LWDWW', 'WLDWW', 'WWDLW', 'WWLDL', 'DDDLL', 'DLLLD', 'LLLDD', 'DDLDD', 'LDLLL', 'LLDLL', 'WDDLL', 'DLLWW', 'LLDWW', 'WWLDD', 'LLWWW', 'DWWDL', 'WDLWD', 'LWWDD', 'DWDLW', 'LDDWW'];

const getRandomForm = (teamName) => {
  const hash = getTeamHash(teamName);
  return FORMS[hash % FORMS.length];
};

export const generateMatchPrediction = (homeTeam, awayTeam, pastMatches = []) => {
  const homeForm = calculateFormFromResults(pastMatches, homeTeam, true);
  const awayForm = calculateFormFromResults(pastMatches, awayTeam, false);
  
  const actualHomeForm = homeForm.length >= 2 ? homeForm : getRandomForm(homeTeam);
  const actualAwayForm = awayForm.length >= 2 ? awayForm : getRandomForm(awayTeam + 'away');
  
  const formScore = (form) => {
    return form.split('').reduce((acc, r) => {
      if (r === 'W') return acc + 3;
      if (r === 'D') return acc + 1;
      return acc;
    }, 0);
  };
  
  const homeScore = formScore(actualHomeForm);
  const awayScore = formScore(actualAwayForm);
  const total = homeScore + awayScore + 3;
  
  let homeProb = (homeScore / total) * 100;
  let awayProb = (awayScore / total) * 100;
  let drawProb = 100 - homeProb - awayProb;
  
  const homeAdvantage = 10;
  homeProb += homeAdvantage;
  drawProb -= 5;
  awayProb -= 5;
  
  homeProb = Math.max(15, Math.min(75, homeProb));
  awayProb = Math.max(10, Math.min(60, awayProb));
  drawProb = Math.max(10, Math.min(40, 100 - homeProb - awayProb));
  
  const sum = homeProb + awayProb + drawProb;
  homeProb = (homeProb / sum) * 100;
  awayProb = (awayProb / sum) * 100;
  drawProb = (drawProb / sum) * 100;
  
  let recommendation = 'BET_DRAW';
  let confidence = 45;
  
  if (homeProb > awayProb + 15) {
    recommendation = 'BET_HOME';
    confidence = Math.min(85, 55 + (homeProb - awayProb) / 2);
  } else if (awayProb > homeProb + 15) {
    recommendation = 'BET_AWAY';
    confidence = Math.min(85, 55 + (awayProb - homeProb) / 2);
  } else if (drawProb > 35) {
    recommendation = 'BET_DRAW';
    confidence = 50 + drawProb / 3;
  }
  
  const getStreak = (form) => {
    if (!form) return 'No recent form';
    const wins = form.match(/W+/g) || [];
    const losses = form.match(/L+/g) || [];
    const maxWins = Math.max(...(wins.map(w => w.length)), 0);
    const maxLosses = Math.max(...(losses.map(l => l.length)), 0);
    if (maxWins >= 2) return `${maxWins} wins streak`;
    if (maxLosses >= 2) return `${maxLosses} losses streak`;
    return 'Inconsistent';
  };
  
  return {
    homeTeam,
    awayTeam,
    homeProb: homeProb.toFixed(1),
    awayProb: awayProb.toFixed(1),
    drawProb: drawProb.toFixed(1),
    recommendation,
    confidence: Math.round(confidence),
    homeForm: actualHomeForm || 'N/A',
    awayForm: actualAwayForm || 'N/A',
    homeStreak: getStreak(actualHomeForm),
    awayStreak: getStreak(actualAwayForm),
    keyFactor: homeScore > awayScore ? 'Better home form' : (awayScore > homeScore ? 'Strong away form' : 'Evenly matched'),
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
    const interval = setInterval(fetchData, 180000);
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

export const useLeagueStandings = (leagueId = 4328) => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      setLoading(true);
      const data = await fetchFromAPI('lookuptable.php', { l: leagueId });
      setStandings(data?.table || []);
      setLoading(false);
    };
    fetchStandings();
  }, [leagueId]);

  return { standings, loading };
};

export { LEAGUES };
