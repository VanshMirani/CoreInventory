import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import '../styles/dashboard.css';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar" style={navbarStyle}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 700, fontSize: '1.25rem' }}>
        Electrostock
      </Link>
      <div style={{ flex: 1, maxWidth: 400, margin: '0 1rem' }}>
        <SearchBar />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{user?.name}</span>
        <Link to="/profile" className="btn-secondary" style={{ padding: '0.4rem 0.75rem' }}>
          Profile
        </Link>
        <button type="button" className="btn-secondary" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

const navbarStyle = {
  gridArea: 'navbar',
  display: 'flex',
  alignItems: 'center',
  padding: '0 1.5rem',
  background: 'var(--bg-secondary)',
  borderBottom: '1px solid var(--border)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
};
