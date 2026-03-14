import React, { useState, useEffect } from 'react';
import api from '../services/api';
import productService from '../services/productService';
import ProductTable from '../components/ProductTable';
import FilterPanel from '../components/FilterPanel';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [filters, setFilters] = useState({ limit: 50, offset: 0 });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
const [form, setForm] = useState({ name: '', sku: '', description: '', category_id: '', unit_price: '', min_stock_level: '', initial_warehouse_id: '', initial_quantity: '' });

  const load = () => {
    setLoading(true);
Promise.all([
      productService.getProducts(filters),
      api.get('/categories').then((r) => r.data),
      api.get('/warehouses').then((r) => r.data),
    ])
      .then(([data, cats, whs]) => {
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setCategories(cats || []);
        setWarehouses(whs || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), [filters.search, filters.category_id, filters.offset]);

  const setFilter = (key, value) => setFilters((p) => ({ ...p, [key]: value, offset: 0 }));
  const clearFilters = () => setFilters({ limit: 50, offset: 0 });

  const openCreate = () => {
setForm({ name: '', sku: '', description: '', category_id: '', unit_price: '', min_stock_level: '0', initial_warehouse_id: '', initial_quantity: '' });
    setModal('create');
  };
  const openEdit = (p) => {
    setForm({
      name: p.name,
      sku: p.sku,
      description: p.description || '',
      category_id: p.category_id || '',
      unit_price: p.unit_price ?? '',
      min_stock_level: p.min_stock_level ?? '',
      initial_warehouse_id: '',
      initial_quantity: '',
    });
    setModal({ type: 'edit', id: p.id });
  };
  const save = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      category_id: form.category_id || null,
      unit_price: parseFloat(form.unit_price) || 0,
      min_stock_level: parseInt(form.min_stock_level, 10) || 0,
      initial_warehouse_id: form.initial_warehouse_id || null,
      initial_quantity: parseInt(form.initial_quantity || 0, 10),
    };
    if (form.sku) payload.sku = form.sku;
    if (modal.type === 'edit') {
      await productService.updateProduct(modal.id, payload);
    } else {
      await productService.createProduct(payload);
    }
    setModal(null);
    load();
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await productService.deleteProduct(id);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1>Products</h1>
        <button type="button" className="btn-primary" onClick={openCreate}>Add product</button>
      </div>
      <FilterPanel
        filters={filters}
        onFilterChange={setFilter}
        onClear={clearFilters}
        fields={[
          { name: 'search', label: 'Search', placeholder: 'Name or SKU' },
          { name: 'category_id', label: 'Category', type: 'select', options: categories.map((c) => ({ value: c.id, label: c.name })) },
        ]}
      />
      {loading ? <p>Loading…</p> : <ProductTable products={products} onEdit={openEdit} onDelete={remove} />}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === 'create' ? 'New product' : 'Edit product'}</h2>
              <button type="button" className="btn-secondary" onClick={() => setModal(null)}>Cancel</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>SKU</label>
                <input value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} placeholder="Leave empty to auto-generate" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={form.category_id} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}>
                  <option value="">None</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Unit price</label>
                <input type="number" step="0.01" value={form.unit_price} onChange={(e) => setForm((f) => ({ ...f, unit_price: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Min stock level</label>
                <input type="number" value={form.min_stock_level} onChange={(e) => setForm((f) => ({ ...f, min_stock_level: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Initial warehouse</label>
                <select value={form.initial_warehouse_id} onChange={(e) => setForm((f) => ({ ...f, initial_warehouse_id: e.target.value }))}>
                  <option value="">No initial stock</option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Initial quantity</label>
                <input type="number" min="0" value={form.initial_quantity} onChange={(e) => setForm((f) => ({ ...f, initial_quantity: e.target.value }))} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button type="button" className="btn-primary" onClick={save}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
