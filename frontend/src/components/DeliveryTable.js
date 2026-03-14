import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatters';

export default function DeliveryTable({ deliveries, onDelete }) {
  if (!deliveries?.length) {
    return <div className="empty-state"><p>No deliveries found.</p></div>;
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Warehouse</th>
            <th>Customer</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((d) => (
            <tr key={d.id}>
              <td>{formatDate(d.delivery_date)}</td>
              <td>{d.warehouse_name || '—'}</td>
              <td>{d.customer_name || '—'}</td>
              <td>
                <Link to={`/deliveries/${d.id}`} className="btn-secondary" style={{ marginRight: 4 }}>View</Link>
                {onDelete && <button type="button" className="btn-danger" onClick={() => onDelete(d.id)}>Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
