import React from 'react';
import { formatCurrency } from '../utils/formatters';

export default function InventoryTable({ items }) {
  if (!items?.length) {
    return <div className="empty-state"><p>No inventory records.</p></div>;
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Warehouse</th>
            <th>Product</th>
            <th>SKU</th>
            <th>Quantity</th>
            <th>Min level</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => {
            const low = i.min_stock_level > 0 && i.quantity <= i.min_stock_level;
            return (
              <tr key={i.id}>
                <td>{i.warehouse_name}</td>
                <td>{i.product_name}</td>
                <td>{i.sku}</td>
                <td>
                  <span className={low ? 'badge badge-danger' : ''}>{i.quantity}</span>
                </td>
                <td>{i.min_stock_level ?? 0}</td>
                <td>{formatCurrency((i.quantity || 0) * (i.unit_price || 0))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
