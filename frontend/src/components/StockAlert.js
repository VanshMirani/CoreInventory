import React from 'react';
import { Link } from 'react-router-dom';
import { formatNumber } from '../utils/formatters';

export default function StockAlert({ items }) {
  if (!items?.length) return null;
  return (
    <div className="card" style={{ marginBottom: '1.5rem', borderColor: 'var(--warning)' }}>
      <h3 style={{ marginBottom: '0.5rem', color: 'var(--warning)' }}>Low stock</h3>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {items.slice(0, 5).map((item) => (
          <li key={item.id} style={{ padding: '0.25rem 0', fontSize: '0.875rem' }}>
            <Link to={`/inventory?warehouse=${item.warehouse_id}`} style={{ color: 'var(--accent)' }}>
              {item.product_name}
            </Link>
            {' '}({item.warehouse_name}): {formatNumber(item.quantity)} / {formatNumber(item.min_stock_level)}
          </li>
        ))}
      </ul>
      {items.length > 5 && (
        <Link to="/inventory?low_stock=true" style={{ fontSize: '0.875rem', color: 'var(--accent)', marginTop: '0.5rem', display: 'inline-block' }}>
          View all ({items.length})
        </Link>
      )}
    </div>
  );
}
