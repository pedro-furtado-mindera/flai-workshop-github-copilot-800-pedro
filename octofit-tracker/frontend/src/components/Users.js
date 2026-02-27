import React, { useEffect, useState, useCallback } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

/** Parse Python-style list string "['a', 'b']" → ['a', 'b'] */
function parseMembersList(raw) {
  if (Array.isArray(raw)) return raw;
  if (!raw) return [];
  return String(raw).replace(/[\[\]'"]/g, '').split(',').map(m => m.trim()).filter(Boolean);
}

function Users() {
  const [users, setUsers]   = useState([]);
  const [teams, setTeams]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  // Edit modal state
  const [editUser, setEditUser]     = useState(null);   // user being edited
  const [formData, setFormData]     = useState({});
  const [selectedTeam, setSelectedTeam] = useState(''); // team _id or ''
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadData = useCallback(() => {
    const usersUrl = `${API_BASE}/api/users/`;
    const teamsUrl = `${API_BASE}/api/teams/`;
    console.log('Users: fetching from', usersUrl);
    console.log('Users: fetching teams from', teamsUrl);

    Promise.all([
      fetch(usersUrl).then(r => { if (!r.ok) throw new Error(`users ${r.status}`); return r.json(); }),
      fetch(teamsUrl).then(r => { if (!r.ok) throw new Error(`teams ${r.status}`); return r.json(); }),
    ])
      .then(([usersJson, teamsJson]) => {
        console.log('Users: fetched users', usersJson);
        console.log('Users: fetched teams', teamsJson);
        setUsers(Array.isArray(usersJson) ? usersJson : (usersJson.results || []));
        setTeams(Array.isArray(teamsJson) ? teamsJson : (teamsJson.results || []));
        setLoading(false);
      })
      .catch(err => {
        console.error('Users: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  /** Return the team that contains this username, or null */
  function findUserTeam(username) {
    return teams.find(t => parseMembersList(t.members).includes(username)) || null;
  }

  function openEdit(user) {
    const team = findUserTeam(user.username);
    setEditUser(user);
    setFormData({ username: user.username, email: user.email });
    setSelectedTeam(team ? team._id : '');
    setSaveError(null);
    setSaveSuccess(false);
  }

  function closeEdit() {
    setEditUser(null);
    setSaveError(null);
    setSaveSuccess(false);
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // 1. PATCH user fields (username + email)
      const userRes = await fetch(`${API_BASE}/api/users/${editUser._id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, email: formData.email }),
      });
      if (!userRes.ok) throw new Error(`Failed to update user (${userRes.status})`);
      const updatedUser = await userRes.json();
      console.log('Users: updated user', updatedUser);

      const oldUsername = editUser.username;
      const newUsername = formData.username;

      // 2. Update team memberships
      const currentTeam = findUserTeam(oldUsername);
      const newTeamId   = selectedTeam;

      // Remove from old team if changed
      if (currentTeam && currentTeam._id !== newTeamId) {
        const oldMembers = parseMembersList(currentTeam.members).filter(m => m !== oldUsername);
        const res = await fetch(`${API_BASE}/api/teams/${currentTeam._id}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ members: oldMembers }),
        });
        if (!res.ok) throw new Error(`Failed to update old team (${res.status})`);
        console.log('Users: removed from team', currentTeam.name);
      }

      // Add to new team (or update username in same team)
      if (newTeamId) {
        const newTeam = teams.find(t => t._id === newTeamId);
        if (newTeam) {
          let members = parseMembersList(newTeam.members).filter(m => m !== oldUsername);
          if (!members.includes(newUsername)) members.push(newUsername);
          const res = await fetch(`${API_BASE}/api/teams/${newTeamId}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ members }),
          });
          if (!res.ok) throw new Error(`Failed to update new team (${res.status})`);
          console.log('Users: added to team', newTeam.name);
        }
      }

      setSaveSuccess(true);
      setSaving(false);
      await loadData(); // refresh table
      setTimeout(closeEdit, 800);
    } catch (err) {
      console.error('Users: save error', err);
      setSaveError(err.message);
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <span className="me-2">⚠️</span>
          <div>Failed to load users: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="page-header">
        <h2>👤 Users</h2>
        <p>All registered members &mdash; {users.length} user{users.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="card octofit-card">
        <div className="card-body p-0">
          {users.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <span style={{ fontSize: '2.5rem' }}>👤</span>
              <p className="mt-2">No users found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 octofit-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Team</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => {
                    const team = findUserTeam(user.username);
                    return (
                      <tr key={user._id || idx}>
                        <td><span className="badge bg-secondary">{idx + 1}</span></td>
                        <td><strong>👤 {user.username}</strong></td>
                        <td>
                          <span className="badge bg-primary bg-opacity-10 text-primary border border-primary">
                            @{user.username}
                          </span>
                        </td>
                        <td>
                          <a href={`mailto:${user.email}`} className="octofit-link">
                            {user.email}
                          </a>
                        </td>
                        <td>
                          {team
                            ? <span className="badge bg-info bg-opacity-10 text-info border border-info">{team.name}</span>
                            : <span className="text-muted">—</span>}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-octofit"
                            onClick={() => openEdit(user)}
                          >
                            ✏️ Edit
                          </button>
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

      {/* ── Edit Modal ─────────────────────────────────── */}
      {editUser && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content octofit-card">

              <div className="modal-header" style={{ background: 'linear-gradient(90deg,#0f3460,#533483)', color: '#fff', borderRadius: '14px 14px 0 0' }}>
                <h5 className="modal-title">✏️ Edit User &mdash; {editUser.username}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeEdit} />
              </div>

              <div className="modal-body">
                {saveError && (
                  <div className="alert alert-danger py-2">{saveError}</div>
                )}
                {saveSuccess && (
                  <div className="alert alert-success py-2">✅ Saved successfully!</div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-semibold">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.username}
                    onChange={e => setFormData(f => ({ ...f, username: e.target.value }))}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Team</label>
                  <select
                    className="form-select"
                    value={selectedTeam}
                    onChange={e => setSelectedTeam(e.target.value)}
                  >
                    <option value="">— No team —</option>
                    {teams.map(t => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeEdit} disabled={saving}>
                  Cancel
                </button>
                <button className="btn btn-octofit" onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                  ) : '💾 Save Changes'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
