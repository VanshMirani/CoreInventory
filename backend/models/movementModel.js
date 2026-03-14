const { query } = require('../config/db');

const getAll = async (filters = {}) => {
  let sql = `
    SELECT m.*, w.name AS warehouse_name, p.name AS product_name, p.sku, u.name AS created_by_name
    FROM stock_movements m
    LEFT JOIN warehouses w ON m.warehouse_id = w.id
    LEFT JOIN products p ON m.product_id = p.id
    LEFT JOIN users u ON m.created_by = u.id
    WHERE 1=1
  `;
  const params = [];
  if (filters.warehouse_id) {
    sql += ' AND m.warehouse_id = ?';
    params.push(filters.warehouse_id);
  }
  if (filters.product_id) {
    sql += ' AND m.product_id = ?';
    params.push(filters.product_id);
  }
  if (filters.movement_type) {
    sql += ' AND m.movement_type = ?';
    params.push(filters.movement_type);
  }
  if (filters.from_date) {
    sql += ' AND m.movement_date >= ?';
    params.push(filters.from_date);
  }
  if (filters.to_date) {
    sql += ' AND m.movement_date <= ?';
    params.push(filters.to_date);
  }
  sql += ' ORDER BY m.movement_date DESC, m.id DESC';
  if (filters.limit) {
    sql += ' LIMIT ?';
    params.push(parseInt(filters.limit, 10));
  }
  if (filters.offset) {
    sql += ' OFFSET ?';
    params.push(parseInt(filters.offset, 10));
  }
  return query(sql, params);
};

const create = async (warehouseId, productId, movementType, quantity, referenceType, referenceId, movementDate, createdBy) => {
  const result = await query(
    `INSERT INTO stock_movements (warehouse_id, product_id, movement_type, quantity, reference_type, reference_id, movement_date, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [warehouseId, productId, movementType, quantity, referenceType || null, referenceId || null, movementDate, createdBy]
  );
  return result.insertId;
};

module.exports = { getAll, create };
