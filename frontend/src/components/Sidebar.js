import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/products', label: 'Products' },
  { to: '/categories', label: 'Categories' },
  { to: '/warehouses', label: 'Warehouses' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/receipts', label: 'Receipts' },
  { to: '/deliveries', label: 'Deliveries' },
  { to: '/transfers', label: 'Transfers' },
  { to: '/adjustments', label: 'Adjustments' },
  { to: '/movements', label: 'Movements' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar" style={sidebarStyle}>
      <nav style={{ padding: '0.5rem 0' }}>
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'block',
              padding: '0.6rem 1rem',
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              textDecoration: 'none',
              borderRadius: 'var(--radius)',
              marginBottom: 2,
              fontWeight: isActive ? 600 : 500,
              background: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

const sidebarStyle = {
  gridArea: 'sidebar',
  background: 'var(--bg-secondary)',
  borderRight: '1px solid var(--border)',
  overflowY: 'auto',
};
