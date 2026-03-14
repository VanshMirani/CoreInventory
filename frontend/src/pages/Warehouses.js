import React, { useState, useEffect } from 'react';
import api from '../services/api';
import WarehouseTable from '../components/WarehouseTable';

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', location: '', description: '' });

  const load = () => {
    setLoading(true);
    api.get('/warehouses').then((r) => { setWarehouses(r.data || []); }).finally(() => setLoading(false));
  };
  useEffect(() => load(), []);

  const openCreate = () => { setForm({ name: '', location: '', description: '' }); setModal('create'); };
  const openEdit = (w) => { setForm({ name: w.name, location: w.location, description: w.description || '' }); setModal({ type: 'edit', id: w.id }); };
  const save = async () => {
    if (modal === 'create') await api.post('/warehouses', form);
    else await api.put(`/warehouses/${modal.id}`, form);
    setModal(null);
    load();
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this warehouse?')) return;
    await api.delete(`/warehouses/${id}`);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1>Warehouses</h1>
        <button type="button" className="btn-primary" onClick={openCreate}>Add warehouse</button>
      </div>
      {loading ? <p>Loading…</p> : <WarehouseTable warehouses={warehouses} onEdit={openEdit} onDelete={remove} />}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>{modal === 'create' ? 'New warehouse' : 'Edit warehouse'}</h2><button type="button" className="btn-secondary" onClick={() => setModal(null)}>Cancel</button></div>
            <div className="modal-body">
              <div className="form-group"><label>Name</label><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
              <div className="form-group"><label>Location</label><input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} /></div>
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
