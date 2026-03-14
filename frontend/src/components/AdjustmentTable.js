import React from 'react';
import { formatDate, formatNumber } from '../utils/formatters';

export default function AdjustmentTable({ adjustments }) {
  if (!adjustments?.length) {
    return <div className="empty-state"><p>No adjustments found.</p></div>;
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Warehouse</th>
            <th>Product</th>
            <th>Change</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {adjustments.map((a) => (
            <tr key={a.id}>
              <td>{formatDate(a.adjustment_date)}</td>
              <td>{a.warehouse_name}</td>
              <td>{a.product_name} ({a.sku})</td>
              <td>
                <span className={a.quantity_change >= 0 ? 'badge badge-success' : 'badge badge-danger'}>
                  {a.quantity_change >= 0 ? '+' : ''}{formatNumber(a.quantity_change)}
                </span>
              </td>
              <td>{a.reason || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
