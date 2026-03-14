import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CategoryTable from '../components/CategoryTable';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const load = () => {
    setLoading(true);
    api.get('/categories').then((r) => { setCategories(r.data || []); }).finally(() => setLoading(false));
  };
  useEffect(() => load(), []);

  const openCreate = () => { setForm({ name: '', description: '' }); setModal('create'); };
  const openEdit = (c) => { setForm({ name: c.name, description: c.description || '' }); setModal({ type: 'edit', id: c.id }); };
  const save = async () => {
    if (modal === 'create') await api.post('/categories', form);
    else await api.put(`/categories/${modal.id}`, form);
    setModal(null);
    load();
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await api.delete(`/categories/${id}`);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1>Categories</h1>
        <button type="button" className="btn-primary" onClick={openCreate}>Add category</button>
      </div>
      {loading ? <p>Loading…</p> : <CategoryTable categories={categories} onEdit={openEdit} onDelete={remove} />}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>{modal === 'create' ? 'New category' : 'Edit category'}</h2><button type="button" className="btn-secondary" onClick={() => setModal(null)}>Cancel</button></div>
            <div className="modal-body">
              <div className="form-group"><label>Name</label><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
              <div className="form-group"><label>Description</label><textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} /></div>
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
