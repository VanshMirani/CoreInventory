import React, { useState, useEffect } from 'react';
import api from '../services/api';
import inventoryService from '../services/inventoryService';
import InventoryTable from '../components/InventoryTable';
import FilterPanel from '../components/FilterPanel';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const params = {};
    if (filters.warehouse_id) params.warehouse_id = filters.warehouse_id;
    if (filters.low_stock) params.low_stock = 'true';
    inventoryService.getInventory(params).then(setItems).finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get('/warehouses').then((r) => setWarehouses(r.data || []));
  }, []);
  useEffect(() => load(), [filters.warehouse_id, filters.low_stock]);

  const setFilter = (key, value) => setFilters((p) => ({ ...p, [key]: value }));
  const clearFilters = () => setFilters({});

  return (
    <div>
      <div className="page-header">
        <h1>Inventory</h1>
      </div>
      <FilterPanel
        filters={filters}
        onFilterChange={setFilter}
        onClear={clearFilters}
        fields={[
          { name: 'warehouse_id', label: 'Warehouse', type: 'select', options: warehouses.map((w) => ({ value: w.id, label: w.name })) },
          { name: 'low_stock', label: 'Low stock only', type: 'select', options: [{ value: 'true', label: 'Yes' }] },
        ]}
      />
      {loading ? <p>Loading…</p> : <InventoryTable items={items} />}
    </div>
  );
}
