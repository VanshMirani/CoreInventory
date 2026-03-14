import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatters';

export default function ReceiptTable({ receipts, onDelete }) {
  if (!receipts?.length) {
    return <div className="empty-state"><p>No receipts found.</p></div>;
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Warehouse</th>
            <th>Created by</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {receipts.map((r) => (
            <tr key={r.id}>
              <td>{formatDate(r.receipt_date)}</td>
              <td>{r.warehouse_name || '—'}</td>
              <td>{r.created_by_name || '—'}</td>
              <td>
                <Link to={`/receipts/${r.id}`} className="btn-secondary" style={{ marginRight: 4 }}>View</Link>
                {onDelete && <button type="button" className="btn-danger" onClick={() => onDelete(r.id)}>Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
