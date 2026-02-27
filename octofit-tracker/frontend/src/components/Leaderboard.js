import React, { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function rankBadgeClass(idx) {
  if (idx === 0) return 'rank-badge gold';
  if (idx === 1) return 'rank-badge silver';
  if (idx === 2) return 'rank-badge bronze';
  return 'rank-badge';
}

/** Parse the Python-style list string "['a', 'b']" into ['a', 'b'] */
function parseMembersList(raw) {
  if (Array.isArray(raw)) return raw;
  if (!raw) return [];
  return String(raw)
    .replace(/[\[\]'"]/g, '')
    .split(',')
    .map(m => m.trim())
    .filter(Boolean);
}

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [teamMap, setTeamMap] = useState({});       // username → team name
  const [caloriesMap, setCaloriesMap] = useState({}); // username → total calories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const leaderboardUrl = `${API_BASE}/api/leaderboard/`;
    const teamsUrl       = `${API_BASE}/api/teams/`;
    const activitiesUrl  = `${API_BASE}/api/activities/`;

    console.log('Leaderboard: fetching from', leaderboardUrl);
    console.log('Leaderboard: fetching teams from', teamsUrl);
    console.log('Leaderboard: fetching activities from', activitiesUrl);

    Promise.all([
      fetch(leaderboardUrl).then(r => { if (!r.ok) throw new Error(`leaderboard ${r.status}`); return r.json(); }),
      fetch(teamsUrl).then(r => { if (!r.ok) throw new Error(`teams ${r.status}`); return r.json(); }),
      fetch(activitiesUrl).then(r => { if (!r.ok) throw new Error(`activities ${r.status}`); return r.json(); }),
    ])
      .then(([lbJson, teamsJson, activitiesJson]) => {
        console.log('Leaderboard: leaderboard data', lbJson);
        console.log('Leaderboard: teams data', teamsJson);
        console.log('Leaderboard: activities data', activitiesJson);

        const lbData         = Array.isArray(lbJson)         ? lbJson         : (lbJson.results         || []);
        const teamsData      = Array.isArray(teamsJson)      ? teamsJson      : (teamsJson.results      || []);
        const activitiesData = Array.isArray(activitiesJson) ? activitiesJson : (activitiesJson.results || []);

        // Build username → team name map
        const tMap = {};
        teamsData.forEach(team => {
          parseMembersList(team.members).forEach(member => {
            tMap[member] = team.name;
          });
        });

        // Build username → total calories map  (calories ≈ duration × 8 MET estimate)
        const cMap = {};
        activitiesData.forEach(activity => {
          const user = activity.username;
          if (!cMap[user]) cMap[user] = 0;
          cMap[user] += Math.round((activity.duration || 0) * 8);
        });

        setEntries(lbData);
        setTeamMap(tMap);
        setCaloriesMap(cMap);
        setLoading(false);
      })
      .catch(err => {
        console.error('Leaderboard: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <span className="me-2">⚠️</span>
          <div>Failed to load leaderboard: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="page-header">
        <h2>📊 Leaderboard</h2>
        <p>Top performers ranked by score &mdash; {entries.length} player{entries.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="card octofit-card">
        <div className="card-body p-0">
          {entries.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <span style={{ fontSize: '2.5rem' }}>📊</span>
              <p className="mt-2">No leaderboard entries found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 octofit-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>User</th>
                    <th>Team</th>
                    <th>Score</th>
                    <th>Total Calories</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, idx) => (
                    <tr key={entry._id || idx} className={idx === 0 ? 'table-warning' : ''}>
                      <td><span className={rankBadgeClass(idx)}>{idx + 1}</span></td>
                      <td><strong>{entry.username}</strong></td>
                      <td>
                        {teamMap[entry.username]
                          ? <span className="badge bg-info bg-opacity-10 text-info border border-info">{teamMap[entry.username]}</span>
                          : <span className="text-muted">—</span>}
                      </td>
                      <td>
                        <span className="badge bg-success bg-opacity-10 text-success border border-success fs-6 px-3">
                          {entry.score}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-warning bg-opacity-10 text-warning border border-warning fs-6 px-3">
                          🔥 {caloriesMap[entry.username] || 0} kcal
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
