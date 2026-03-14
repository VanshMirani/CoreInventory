import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TransferTable from '../components/TransferTable';
import FilterPanel from '../components/FilterPanel';

export default function Transfers() {
  const [transfers, setTransfers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ from_warehouse_id: '', to_warehouse_id: '', product_id: '', quantity: '', notes: '' });

  const load = () => {
    setLoading(true);
    api.get('/transfers', { params: filters }).then((r) => { setTransfers(r.data || []); }).finally(() => setLoading(false));
  };
  useEffect(() => load(), [filters.from_date, filters.to_date, filters.warehouse_id]);
  useEffect(() => {
    api.get('/warehouses').then((r) => setWarehouses(r.data || []));
    api.get('/products', { params: { limit: 200 } }).then((r) => setProducts(r.data?.products || []));
  }, []);

  const setFilter = (key, value) => setFilters((p) => ({ ...p, [key]: value }));
  const clearFilters = () => setFilters({});
  const openCreate = () => {
    setForm({ from_warehouse_id: '', to_warehouse_id: '', product_id: '', quantity: '', notes: '' });
    setModal(true);
  };
  const save = async () => {
    const qty = parseInt(form.quantity, 10);
    if (!form.from_warehouse_id || !form.to_warehouse_id || !form.product_id || !qty || qty < 1) {
      alert('From warehouse, to warehouse, product and positive quantity are required.');
      return;
    }
    if (form.from_warehouse_id === form.to_warehouse_id) {
      alert('Source and destination must be different.');
      return;
    }
    await api.post('/transfers', {
      from_warehouse_id: parseInt(form.from_warehouse_id, 10),
      to_warehouse_id: parseInt(form.to_warehouse_id, 10),
      product_id: parseInt(form.product_id, 10),
      quantity: qty,
      notes: form.notes,
    });
    setModal(false);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1>Transfers</h1>
        <button type="button" className="btn-primary" onClick={openCreate}>New transfer</button>
      </div>
      <FilterPanel filters={filters} onFilterChange={setFilter} onClear={clearFilters} fields={[
        { name: 'warehouse_id', label: 'Warehouse', type: 'select', options: warehouses.map((w) => ({ value: w.id, label: w.name })) },
        { name: 'from_date', label: 'From', type: 'date' },
        { name: 'to_date', label: 'To', type: 'date' },
      ]} />
      {loading ? <p>Loading…</p> : <TransferTable transfers={transfers} />}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>New transfer</h2><button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button></div>
            <div className="modal-body">
              <div className="form-group">
                <label>From warehouse</label>
                <select value={form.from_warehouse_id} onChange={(e) => setForm((f) => ({ ...f, from_warehouse_id: e.target.value }))} required>
                  <option value="">Select</option>
                  {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>To warehouse</label>
                <select value={form.to_warehouse_id} onChange={(e) => setForm((f) => ({ ...f, to_warehouse_id: e.target.value }))} required>
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
                <label>Quantity</label>
                <input type="number" min={1} value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button type="button" className="btn-primary" onClick={save}>Transfer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
