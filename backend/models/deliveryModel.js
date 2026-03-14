const { query } = require('../config/db');

const getAll = async (filters = {}) => {
  let sql = `
    SELECT d.*, w.name AS warehouse_name, u.name AS created_by_name
    FROM deliveries d
    LEFT JOIN warehouses w ON d.warehouse_id = w.id
    LEFT JOIN users u ON d.created_by = u.id
    WHERE 1=1
  `;
  const params = [];
  if (filters.warehouse_id) {
    sql += ' AND d.warehouse_id = ?';
    params.push(filters.warehouse_id);
  }
  if (filters.from_date) {
    sql += ' AND d.delivery_date >= ?';
    params.push(filters.from_date);
  }
  if (filters.to_date) {
    sql += ' AND d.delivery_date <= ?';
    params.push(filters.to_date);
  }
  sql += ' ORDER BY d.delivery_date DESC, d.id DESC';
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

const getById = async (id) => {
  const rows = await query(
    `SELECT d.*, w.name AS warehouse_name, u.name AS created_by_name
     FROM deliveries d
     LEFT JOIN warehouses w ON d.warehouse_id = w.id
     LEFT JOIN users u ON d.created_by = u.id
     WHERE d.id = ?`,
    [id]
  );
  return rows[0];
};

const create = async (warehouseId, deliveryDate, customerName, notes, createdBy) => {
  const result = await query(
    'INSERT INTO deliveries (warehouse_id, delivery_date, customer_name, notes, created_by) VALUES (?, ?, ?, ?, ?)',
    [warehouseId, deliveryDate, customerName || '', notes || '', createdBy]
  );
  return result.insertId;
};

const remove = async (id) => {
  await query('DELETE FROM delivery_items WHERE delivery_id = ?', [id]);
  await query('DELETE FROM deliveries WHERE id = ?', [id]);
  return id;
};

module.exports = { getAll, getById, create, remove };
