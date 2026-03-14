export function buildProductParams(filters) {
  const params = {};
  if (filters.category_id) params.category_id = filters.category_id;
  if (filters.search) params.search = filters.search;
  if (filters.limit) params.limit = filters.limit;
  if (filters.offset) params.offset = filters.offset;
  return params;
}

export function buildDateParams(filters) {
  const params = {};
  if (filters.warehouse_id) params.warehouse_id = filters.warehouse_id;
  if (filters.from_date) params.from_date = filters.from_date;
  if (filters.to_date) params.to_date = filters.to_date;
  if (filters.limit) params.limit = filters.limit;
  if (filters.offset) params.offset = filters.offset;
  return params;
}
