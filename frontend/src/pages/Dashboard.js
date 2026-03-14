import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import DashboardCards from '../components/DashboardCards';
import StockAlert from '../components/StockAlert';
import api from '../services/api';
import { formatDate } from '../utils/formatters';
import '../styles/dashboard.css';

export default function Dashboard() {
  const { stats, activity, loading, error } = useDashboard();
  const [alerts, setAlerts] = React.useState([]);

  React.useEffect(() => {
    api.get('/alerts/low-stock').then((res) => setAlerts(res.data)).catch(() => setAlerts([]));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
      <DashboardCards stats={stats} loading={loading} />
      <StockAlert items={alerts} />
      <div className="dashboard-grid">
        <div className="section-card">
          <h2>Recent activity</h2>
          <div className="content">
            {activity.length === 0 && !loading && <div className="empty-state"><p>No recent activity</p></div>}
            <ul className="activity-list">
              {activity.map((a, i) => (
                <li key={`${a.type}-${a.id}-${i}`}>
                  <span><span className="type">{a.type}</span> #{a.id}</span>
                  <span className="date">{formatDate(a.date)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="section-card">
          <h2>Quick links</h2>
          <div className="content">
            <p><a href="/receipts" style={{ color: 'var(--accent)' }}>New receipt</a> · <a href="/deliveries" style={{ color: 'var(--accent)' }}>New delivery</a> · <a href="/inventory" style={{ color: 'var(--accent)' }}>Inventory</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
