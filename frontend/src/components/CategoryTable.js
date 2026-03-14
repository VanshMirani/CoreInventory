import React from 'react';

export default function CategoryTable({ categories, onEdit, onDelete }) {
  if (!categories?.length) {
    return <div className="empty-state"><p>No categories found.</p></div>;
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.description || '—'}</td>
              <td>
                {onEdit && <button type="button" className="btn-secondary" style={{ marginRight: 4 }} onClick={() => onEdit(c)}>Edit</button>}
                {onDelete && <button type="button" className="btn-danger" onClick={() => onDelete(c.id)}>Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
