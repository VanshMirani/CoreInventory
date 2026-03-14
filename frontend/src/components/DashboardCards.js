import React from 'react';
import { formatCurrency, formatNumber } from '../utils/formatters';
import '../styles/dashboard.css';

export default function DashboardCards({ stats, loading }) {
  if (loading || !stats) {
    return (
      <div className="dashboard-cards">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="dashboard-card" style={{ minHeight: 80 }} />
        ))}
      </div>
    );
  }

  const cards = [
    { label: 'Total Products', value: formatNumber(stats.totalProducts) },
    { label: 'Warehouses', value: formatNumber(stats.totalWarehouses) },
    { label: 'Total Receipts', value: formatNumber(stats.totalReceipts) },
    { label: 'Total Deliveries', value: formatNumber(stats.totalDeliveries) },
    { label: 'Low Stock Items', value: formatNumber(stats.lowStockCount), danger: stats.lowStockCount > 0 },
    { label: 'Inventory Value', value: formatCurrency(stats.totalInventoryValue), accent: true },
  ];

  return (
    <div className="dashboard-cards">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`dashboard-card ${c.accent ? 'accent' : ''} ${c.danger ? 'danger' : ''}`}
        >
          <div className="label">{c.label}</div>
          <div className="value">{c.value}</div>
        </div>
      ))}
    </div>
  );
}
