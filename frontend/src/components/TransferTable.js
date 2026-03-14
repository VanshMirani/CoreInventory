import React from 'react';
import { formatDate, formatNumber } from '../utils/formatters';

export default function TransferTable({ transfers }) {
  if (!transfers?.length) {
    return <div className="empty-state"><p>No transfers found.</p></div>;
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Product</th>
            <th>From</th>
            <th>To</th>
            <th>Qty</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((t) => (
            <tr key={t.id}>
              <td>{formatDate(t.transfer_date)}</td>
              <td>{t.product_name} ({t.sku})</td>
              <td>{t.from_warehouse_name}</td>
              <td>{t.to_warehouse_name}</td>
              <td>{formatNumber(t.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
