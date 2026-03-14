const buildProductFilters = (query) => {
  const filters = {};
  if (query.category_id) filters.category_id = query.category_id;
  if (query.search) filters.search = query.search.trim();
  if (query.limit) filters.limit = Math.min(parseInt(query.limit, 10) || 50, 100);
  if (query.offset) filters.offset = parseInt(query.offset, 10) || 0;
  return filters;
};

const buildDateFilters = (query, dateField = 'date') => {
  const filters = {};
  if (query.from_date) filters.from_date = query.from_date;
  if (query.to_date) filters.to_date = query.to_date;
  if (query.warehouse_id) filters.warehouse_id = query.warehouse_id;
  if (query.limit) filters.limit = Math.min(parseInt(query.limit, 10) || 50, 100);
  if (query.offset) filters.offset = parseInt(query.offset, 10) || 0;
  return filters;
};

const buildMovementFilters = (query) => {
  const filters = buildDateFilters(query);
  if (query.product_id) filters.product_id = query.product_id;
  if (query.movement_type) filters.movement_type = query.movement_type;
  return filters;
};

module.exports = { buildProductFilters, buildDateFilters, buildMovementFilters };
