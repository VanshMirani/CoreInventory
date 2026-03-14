import React from 'react';
import { formatDate, formatNumber } from '../utils/formatters';

export default function MovementHistoryTable({ movements }) {
  if (!movements?.length) {
    return <div className="empty-state"><p>No movements found.</p></div>;
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Warehouse</th>
            <th>Product</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Reference</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((m) => (
            <tr key={m.id}>
              <td>{formatDate(m.movement_date)}</td>
              <td>{m.warehouse_name || '—'}</td>
              <td>{m.product_name} ({m.sku})</td>
              <td>
                <span className={m.movement_type === 'in' ? 'badge badge-success' : 'badge badge-danger'}>
                  {m.movement_type}
                </span>
              </td>
              <td>{m.quantity >= 0 ? '+' : ''}{formatNumber(m.quantity)}</td>
              <td>{m.reference_type || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
