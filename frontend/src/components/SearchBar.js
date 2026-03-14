import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function SearchBar() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const v = e.target.value;
    setQ(v);
    if (v.length < 2) {
      setResults(null);
      setOpen(false);
      return;
    }
    api.get('/search', { params: { q: v } })
      .then((res) => {
        setResults(res.data);
        setOpen(true);
      })
      .catch(() => setResults(null));
  };

  const handleSelect = (type, id) => {
    setOpen(false);
    setQ('');
    if (type === 'product') navigate(`/products?highlight=${id}`);
    if (type === 'category') navigate(`/categories`);
    if (type === 'warehouse') navigate(`/inventory?warehouse=${id}`);
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="search"
        placeholder="Search products, categories..."
        value={q}
        onChange={handleChange}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onFocus={() => q.length >= 2 && setOpen(true)}
        style={{ width: '100%' }}
      />
      {open && results && (
        <div
          className="card"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            maxHeight: 320,
            overflowY: 'auto',
            zIndex: 200,
          }}
        >
          {results.products?.length > 0 && (
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>Products</div>
              {results.products.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.4rem 0',
                    textAlign: 'left',
                    background: 'none',
                    color: 'inherit',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSelect('product', p.id)}
                >
                  {p.name} ({p.sku})
                </button>
              ))}
            </div>
          )}
          {results.categories?.length > 0 && (
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Categories</div>
          )}
          {!results.products?.length && !results.categories?.length && !results.warehouses?.length && (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No results</div>
          )}
        </div>
      )}
    </div>
  );
}
