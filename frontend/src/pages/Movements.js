import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MovementHistoryTable from '../components/MovementHistoryTable';
import FilterPanel from '../components/FilterPanel';

export default function Movements() {
  const [movements, setMovements] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [filters, setFilters] = useState({ limit: 100 });
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/movements', { params: filters }).then((r) => { setMovements(r.data || []); }).finally(() => setLoading(false));
  };
  useEffect(() => load(), [filters.warehouse_id, filters.from_date, filters.to_date, filters.movement_type]);
  useEffect(() => {
    api.get('/warehouses').then((r) => setWarehouses(r.data || []));
  }, []);

  const setFilter = (key, value) => setFilters((p) => ({ ...p, [key]: value }));
  const clearFilters = () => setFilters({ limit: 100 });

  return (
    <div>
      <div className="page-header">
        <h1>Movement history</h1>
      </div>
      <FilterPanel filters={filters} onFilterChange={setFilter} onClear={clearFilters} fields={[
        { name: 'warehouse_id', label: 'Warehouse', type: 'select', options: warehouses.map((w) => ({ value: w.id, label: w.name })) },
        { name: 'movement_type', label: 'Type', type: 'select', options: [{ value: 'in', label: 'In' }, { value: 'out', label: 'Out' }] },
        { name: 'from_date', label: 'From', type: 'date' },
        { name: 'to_date', label: 'To', type: 'date' },
      ]} />
      {loading ? <p>Loading…</p> : <MovementHistoryTable movements={movements} />}
    </div>
  );
}
