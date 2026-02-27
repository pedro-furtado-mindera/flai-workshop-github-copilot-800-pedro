import React, { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = `${API_BASE}/api/teams/`;
    console.log('Teams: fetching from', url);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        console.log('Teams: fetched data', json);
        const data = Array.isArray(json) ? json : (json.results || []);
        setTeams(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Teams: fetch error', err);
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
        <p className="mt-2 text-muted">Loading teams...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <span className="me-2">⚠️</span>
          <div>Failed to load teams: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="page-header">
        <h2>🏆 Teams</h2>
        <p>All registered teams &mdash; {teams.length} team{teams.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="card octofit-card">
        <div className="card-body p-0">
          {teams.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <span style={{ fontSize: '2.5rem' }}>🏆</span>
              <p className="mt-2">No teams found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 octofit-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Team Name</th>
                    <th>Members</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team, idx) => {
                    // API returns members as a Python list string e.g. "['ironman', 'spiderman', 'thor']"
                    // Extract names by stripping all brackets and quotes, then splitting on comma
                    let members = [];
                    if (Array.isArray(team.members)) {
                      members = team.members;
                    } else if (team.members) {
                      members = String(team.members)
                        .replace(/[\[\]'"]/g, '')   // remove [ ] ' "
                        .split(',')
                        .map(m => m.trim())
                        .filter(Boolean);
                    }
                    return (
                      <tr key={team._id || idx}>
                        <td><span className="badge bg-secondary">{idx + 1}</span></td>
                        <td><strong>{team.name}</strong></td>
                        <td>
                          {members.map((m, i) => (
                            <span key={i} className="badge bg-info bg-opacity-10 text-info border border-info me-1">
                              {m}
                            </span>
                          ))}
                        </td>
                        <td>
                          <span className="badge bg-primary">{members.length}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Teams;
