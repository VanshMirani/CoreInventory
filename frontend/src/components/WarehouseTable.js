import React from 'react';

export default function WarehouseTable({ warehouses, onEdit, onDelete }) {
  if (!warehouses?.length) {
    return <div className="empty-state"><p>No warehouses found.</p></div>;
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {warehouses.map((w) => (
            <tr key={w.id}>
              <td>{w.name}</td>
              <td>{w.location}</td>
              <td>{w.description || '—'}</td>
              <td>
                {onEdit && <button type="button" className="btn-secondary" style={{ marginRight: 4 }} onClick={() => onEdit(w)}>Edit</button>}
                {onDelete && <button type="button" className="btn-danger" onClick={() => onDelete(w.id)}>Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
