import React, { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = `${API_BASE}/api/workouts/`;
    console.log('Workouts: fetching from', url);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        console.log('Workouts: fetched data', json);
        const data = Array.isArray(json) ? json : (json.results || []);
        setWorkouts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Workouts: fetch error', err);
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
        <p className="mt-2 text-muted">Loading workouts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <span className="me-2">⚠️</span>
          <div>Failed to load workouts: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="page-header">
        <h2>💪 Workouts</h2>
        <p>Personalised workout suggestions &mdash; {workouts.length} workout{workouts.length !== 1 ? 's' : ''}</p>
      </div>

      {workouts.length === 0 ? (
        <div className="card octofit-card">
          <div className="card-body text-center py-5 text-muted">
            <span style={{ fontSize: '2.5rem' }}>💪</span>
            <p className="mt-2">No workouts found.</p>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {workouts.map((workout, idx) => (
            <div className="col-md-6 col-lg-4" key={workout._id || idx}>
              <div className="card octofit-card h-100">
                <div className="card-header" style={{ background: 'linear-gradient(90deg, #0f3460, #533483)', color: '#fff' }}>
                  <strong>💪 {workout.name}</strong>
                </div>
                <div className="card-body">
                  <p className="card-text text-muted">
                    {workout.description || <em>No description provided.</em>}
                  </p>
                </div>
                <div className="card-footer bg-transparent border-top-0">
                  <span className="badge bg-primary bg-opacity-10 text-primary border border-primary">
                    Workout #{idx + 1}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Workouts;
