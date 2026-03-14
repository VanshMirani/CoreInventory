import React from 'react';

export default function FilterPanel({ filters, onFilterChange, onClear, fields }) {
  return (
    <div className="card" style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
      {fields.map((f) => (
        <div key={f.name} className="form-group" style={{ marginBottom: 0, minWidth: 140 }}>
          {f.label && <label>{f.label}</label>}
          {f.type === 'select' ? (
            <select
              value={filters[f.name] ?? ''}
              onChange={(e) => onFilterChange(f.name, e.target.value)}
            >
              <option value="">All</option>
              {f.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <input
              type={f.type || 'text'}
              value={filters[f.name] ?? ''}
              onChange={(e) => onFilterChange(f.name, e.target.value)}
              placeholder={f.placeholder}
            />
          )}
        </div>
      ))}
      <button type="button" className="btn-secondary" onClick={onClear}>
        Clear
      </button>
    </div>
  );
}
