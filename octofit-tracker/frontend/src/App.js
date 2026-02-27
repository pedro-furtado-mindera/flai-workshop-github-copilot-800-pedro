import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import logo from './octofitapp-small.png';

import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const NAV_ITEMS = [
  { path: '/users',       label: 'Users',       icon: '👤' },
  { path: '/teams',       label: 'Teams',       icon: '🏆' },
  { path: '/activities',  label: 'Activities',  icon: '🏃' },
  { path: '/leaderboard', label: 'Leaderboard', icon: '📊' },
  { path: '/workouts',    label: 'Workouts',    icon: '💪' },
];

function Home() {
  return (
    <div className="octofit-hero">
      <img src={logo} alt="OctoFit" className="hero-logo" />
      <h1><span className="hero-title-accent">Octo</span>Fit<br />Tracker</h1>
      <p className="lead">Track activities · Manage teams · Climb the leaderboard</p>
      <div className="hero-cards">
        {NAV_ITEMS.map(({ path, label, icon }) => (
          <NavLink key={path} to={path} className="hero-card">
            <span className="hero-icon">{icon}</span>
            <span className="hero-label">{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark octofit-navbar">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            <img src={logo} alt="OctoFit logo" />
            <span className="brand-text">
              OctoFit Tracker
              <span className="brand-sub">Fitness &amp; Activity Hub</span>
            </span>
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {NAV_ITEMS.map(({ path, label, icon }) => (
                <li className="nav-item" key={path}>
                  <NavLink
                    className={({ isActive }) =>
                      'nav-link' + (isActive ? ' active' : '')
                    }
                    to={path}
                  >
                    {icon} {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users"       element={<Users />} />
          <Route path="/teams"       element={<Teams />} />
          <Route path="/activities"  element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts"    element={<Workouts />} />
        </Routes>
      </main>

      <footer className="octofit-footer">
        © {new Date().getFullYear()} OctoFit Tracker — Built with React &amp; Django
      </footer>
    </Router>
  );
}

export default App;
