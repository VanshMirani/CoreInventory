import React from 'react';
import { formatCurrency } from '../utils/formatters';

export default function ProductTable({ products, onEdit, onDelete }) {
  if (!products?.length) {
    return <div className="empty-state"><p>No products found.</p></div>;
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>Category</th>
            <th>Unit price</th>
            <th>Min stock</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.sku}</td>
              <td>{p.name}</td>
              <td>{p.category_name || '—'}</td>
              <td>{formatCurrency(p.unit_price)}</td>
              <td>{p.min_stock_level ?? 0}</td>
              <td>
                {onEdit && <button type="button" className="btn-secondary" style={{ marginRight: 4 }} onClick={() => onEdit(p)}>Edit</button>}
                {onDelete && <button type="button" className="btn-danger" onClick={() => onDelete(p.id)}>Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
