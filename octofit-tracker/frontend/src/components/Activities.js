import React, { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = `${API_BASE}/api/activities/`;
    console.log('Activities: fetching from', url);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        console.log('Activities: fetched data', json);
        const data = Array.isArray(json) ? json : (json.results || []);
        setActivities(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Activities: fetch error', err);
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
        <p className="mt-2 text-muted">Loading activities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <span className="me-2">⚠️</span>
          <div>Failed to load activities: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="page-header">
        <h2>🏃 Activities</h2>
        <p>All logged fitness activities &mdash; {activities.length} record{activities.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="card octofit-card">
        <div className="card-body p-0">
          {activities.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <span style={{ fontSize: '2.5rem' }}>🏃</span>
              <p className="mt-2">No activities found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 octofit-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Activity Type</th>
                    <th>Duration (min)</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, idx) => (
                    <tr key={activity._id || idx}>
                      <td><span className="badge bg-secondary">{idx + 1}</span></td>
                      <td><strong>{activity.username}</strong></td>
                      <td><span className="badge bg-primary bg-opacity-10 text-primary border border-primary">{activity.activity_type}</span></td>
                      <td>{activity.duration} min</td>
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

export default Activities;
