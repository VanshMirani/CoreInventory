import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AdjustmentTable from '../components/AdjustmentTable';
import FilterPanel from '../components/FilterPanel';

export default function Adjustments() {
  const [adjustments, setAdjustments] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ warehouse_id: '', product_id: '', quantity_change: '', reason: '' });

  const load = () => {
    setLoading(true);
    api.get('/adjustments', { params: filters }).then((r) => { setAdjustments(r.data || []); }).finally(() => setLoading(false));
  };
  useEffect(() => load(), [filters.from_date, filters.to_date, filters.warehouse_id]);
  useEffect(() => {
    api.get('/warehouses').then((r) => setWarehouses(r.data || []));
    api.get('/products', { params: { limit: 200 } }).then((r) => setProducts(r.data?.products || []));
  }, []);

  const setFilter = (key, value) => setFilters((p) => ({ ...p, [key]: value }));
  const clearFilters = () => setFilters({});
  const openCreate = () => {
    setForm({ warehouse_id: '', product_id: '', quantity_change: '', reason: '' });
    setModal(true);
  };
  const save = async () => {
    const change = parseInt(form.quantity_change, 10);
    if (!form.warehouse_id || !form.product_id || isNaN(change)) {
      alert('Warehouse, product and quantity change are required.');
      return;
    }
    await api.post('/adjustments', {
      warehouse_id: parseInt(form.warehouse_id, 10),
      product_id: parseInt(form.product_id, 10),
      quantity_change: change,
      reason: form.reason,
    });
    setModal(false);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1>Adjustments</h1>
        <button type="button" className="btn-primary" onClick={openCreate}>New adjustment</button>
      </div>
      <FilterPanel filters={filters} onFilterChange={setFilter} onClear={clearFilters} fields={[
        { name: 'warehouse_id', label: 'Warehouse', type: 'select', options: warehouses.map((w) => ({ value: w.id, label: w.name })) },
        { name: 'from_date', label: 'From', type: 'date' },
        { name: 'to_date', label: 'To', type: 'date' },
      ]} />
      {loading ? <p>Loading…</p> : <AdjustmentTable adjustments={adjustments} />}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>New adjustment</h2><button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button></div>
            <div className="modal-body">
              <div className="form-group">
                <label>Warehouse</label>
                <select value={form.warehouse_id} onChange={(e) => setForm((f) => ({ ...f, warehouse_id: e.target.value }))} required>
                  <option value="">Select</option>
                  {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Product</label>
                <select value={form.product_id} onChange={(e) => setForm((f) => ({ ...f, product_id: e.target.value }))} required>
                  <option value="">Select</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Quantity change (+ or -)</label>
                <input type="number" value={form.quantity_change} onChange={(e) => setForm((f) => ({ ...f, quantity_change: e.target.value }))} placeholder="e.g. 5 or -3" />
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} rows={2} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button type="button" className="btn-primary" onClick={save}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
