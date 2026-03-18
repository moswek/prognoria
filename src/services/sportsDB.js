import axios from 'axios';

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

export const fetchUpcomingEvents = async (leagueId) => {
  try {
    const response = await axios.get(`${BASE_URL}/eventsnextleague.php`, {
      params: { id: leagueId },
    });
    return response.data.events || [];
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
};

export const fetchPastEvents = async (leagueId) => {
  try {
    const response = await axios.get(`${BASE_URL}/eventspastleague.php`, {
      params: { id: leagueId },
    });
    return response.data.events || [];
  } catch (error) {
    console.error('Error fetching past events:', error);
    return [];
  }
};

export const fetchLeagueStandings = async (leagueId) => {
  try {
    const response = await axios.get(`${BASE_URL}/lookuptable.php`, {
      params: { l: leagueId },
    });
    return response.data.table || [];
  } catch (error) {
    console.error('Error fetching standings:', error);
    return [];
  }
};

export const fetchTeamDetails = async (teamId) => {
  try {
    const response = await axios.get(`${BASE_URL}/lookupteam.php`, {
      params: { id: teamId },
    });
    return response.data.teams ? response.data.teams[0] : null;
  } catch (error) {
    console.error('Error fetching team details:', error);
    return null;
  }
};

export const fetchLiveScores = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/livescore.php`);
    return response.data.events || [];
  } catch (error) {
    console.error('Error fetching live scores:', error);
    return [];
  }
};

export const fetchEventDetails = async (eventId) => {
  try {
    const response = await axios.get(`${BASE_URL}/lookupevent.php`, {
      params: { id: eventId },
    });
    return response.data.events ? response.data.events[0] : null;
  } catch (error) {
    console.error('Error fetching event details:', error);
    return null;
  }
};

export const fetchTeamForm = async (teamId) => {
  try {
    const response = await axios.get(`${BASE_URL}/eventslast.php`, {
      params: { teamId },
    });
    return response.data.results || [];
  } catch (error) {
    console.error('Error fetching team form:', error);
    return [];
  }
};

export const LEAGUE_IDS = {
  EPL: 4328,
  NBA: 4387,
  NFL: 4391,
  MLB: 4424,
  NHL: 4380,
};

export const fetchEventsByLeague = async (leagueId, isPast = false) => {
  if (isPast) {
    return fetchPastEvents(leagueId);
  }
  return fetchUpcomingEvents(leagueId);
};
