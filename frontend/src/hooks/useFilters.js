import { useState, useCallback } from 'react';

export function useFilters(initial = {}) {
  const [filters, setFilters] = useState(initial);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value === '' ? undefined : value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initial);
  }, [initial]);

  const toQuery = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params.set(k, v);
    });
    return params.toString();
  }, [filters]);

  return { filters, setFilter, clearFilters, toQuery };
}
