import React, { useState, useEffect } from 'react';
import deliveryService from '../services/deliveryService';
import api from '../services/api';
import DeliveryTable from '../components/DeliveryTable';
import FilterPanel from '../components/FilterPanel';

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ warehouse_id: '', delivery_date: new Date().toISOString().slice(0, 10), customer_name: '', notes: '', items: [{ product_id: '', quantity: 1, unit_price: '' }] });

  const load = () => {
    setLoading(true);
    deliveryService.getDeliveries(filters).then(setDeliveries).finally(() => setLoading(false));
  };
  useEffect(() => load(), [filters.from_date, filters.to_date, filters.warehouse_id]);
  useEffect(() => {
    api.get('/warehouses').then((r) => setWarehouses(r.data || []));
    api.get('/products', { params: { limit: 200 } }).then((r) => setProducts(r.data?.products || []));
  }, []);

  const setFilter = (key, value) => setFilters((p) => ({ ...p, [key]: value }));
  const clearFilters = () => setFilters({});
  const openCreate = () => {
    setForm({
      warehouse_id: '',
      delivery_date: new Date().toISOString().slice(0, 10),
      customer_name: '',
      notes: '',
      items: [{ product_id: '', quantity: 1, unit_price: '' }],
    });
    setModal(true);
  };
  const addLine = () => setForm((f) => ({ ...f, items: [...f.items, { product_id: '', quantity: 1, unit_price: '' }] }));
  // const updateLine = (i, field, value) => {
  //   setForm((f) => ({ ...f, items: f.items.map((line, j) => (j === i ? { ...line, [field]: value } : line)) }));
  // };
//   const updateLine = (i, field, value) => {
//   setForm((f) => ({
//     ...f,
//     items: f.items.map((line, j) => {
//       if (j !== i) return line;

//       let updatedLine = { ...line, [field]: value };

//       // If product changes, auto set price
//       if (field === 'product_id') {
//         const product = products.find((p) => p.id === parseInt(value));
//         if (product) {
//           updatedLine.unit_price = product.unit_price; // or product.unit_price depending on your API
//         }
//       }

//       return updatedLine;
//     }),
//   }));
// };

const updateLine = (i, field, value) => {
  setForm((f) => ({
    ...f,
    items: f.items.map((line, j) => {
      if (j !== i) return line;

      let updatedLine = { ...line, [field]: value };

      const product = products.find(
        (p) => p.id === parseInt(updatedLine.product_id)
      );

      // When product changes → set base price
      if (field === "product_id" && product) {
        updatedLine.unit_price = product.unit_price * (updatedLine.quantity || 1);
      }

      // When quantity changes → recalculate price
      if (field === "quantity" && product) {
        updatedLine.unit_price = product.unit_price * parseInt(value || 1);
      }

      return updatedLine;
    }),
  }));
};
  const removeLine = (i) => setForm((f) => ({ ...f, items: f.items.filter((_, j) => j !== i) }));
  const save = async () => {
    const items = form.items.filter((l) => l.product_id && l.quantity > 0).map((l) => ({
      product_id: parseInt(l.product_id, 10),
      quantity: parseInt(l.quantity, 10),
      unit_price: parseFloat(l.unit_price) || 0,
    }));
    if (!form.warehouse_id || !form.delivery_date || items.length === 0) {
      alert('Warehouse, date and at least one item are required.');
      return;
    }
    await deliveryService.createDelivery({
      warehouse_id: parseInt(form.warehouse_id, 10),
      delivery_date: form.delivery_date,
      customer_name: form.customer_name,
      notes: form.notes,
      items,
    });
    setModal(false);
    load();
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this delivery?')) return;
    await deliveryService.deleteDelivery(id);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1>Deliveries</h1>
        <button type="button" className="btn-primary" onClick={openCreate}>New delivery</button>
      </div>
      <FilterPanel filters={filters} onFilterChange={setFilter} onClear={clearFilters} fields={[
        { name: 'warehouse_id', label: 'Warehouse', type: 'select', options: warehouses.map((w) => ({ value: w.id, label: w.name })) },
        { name: 'from_date', label: 'From', type: 'date' },
        { name: 'to_date', label: 'To', type: 'date' },
      ]} />
      {loading ? <p>Loading…</p> : <DeliveryTable deliveries={deliveries} onDelete={remove} />}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div className="modal-header"><h2>New delivery</h2><button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button></div>
            <div className="modal-body">
              <div className="form-group">
                <label>Warehouse</label>
                <select value={form.warehouse_id} onChange={(e) => setForm((f) => ({ ...f, warehouse_id: e.target.value }))} required>
                  <option value="">Select</option>
                  {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={form.delivery_date} onChange={(e) => setForm((f) => ({ ...f, delivery_date: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Customer name</label>
                <input value={form.customer_name} onChange={(e) => setForm((f) => ({ ...f, customer_name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} />
              </div>
              <div style={{ marginBottom: 8 }}>Items</div>
              {form.items.map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  {/* <select value={line.product_id} onChange={(e) => updateLine(i, 'product_id', e.target.value)} style={{ flex: 2 }}>
                    <option value="">Product</option>
                    {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                  </select> */}
                  <select
  value={line.product_id}
  onChange={(e) => updateLine(i, 'product_id', e.target.value)}
  style={{ flex: 2 }}
>
  <option value="">Product</option>
  {products.map((p) => (
    <option key={p.id} value={p.id}>
      {p.name} ({p.sku})
    </option>
  ))}
</select>
                  <input type="number" min={1} value={line.quantity} onChange={(e) => updateLine(i, 'quantity', e.target.value)} style={{ width: 70 }} />
                  <input type="number" step="0.01" placeholder="Price" value={line.unit_price} onChange={(e) => updateLine(i, 'unit_price', e.target.value)} style={{ width: 90 }} />
                  <button type="button" className="btn-danger" onClick={() => removeLine(i)}>×</button>
                </div>
              ))}
              <button type="button" className="btn-secondary" onClick={addLine}>Add line</button>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button type="button" className="btn-primary" onClick={save}>Save delivery</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
