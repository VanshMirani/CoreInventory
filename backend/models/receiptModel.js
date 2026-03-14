const { query } = require('../config/db');

const getAll = async (filters = {}) => {
  let sql = `
    SELECT r.*, w.name AS warehouse_name, u.name AS created_by_name
    FROM receipts r
    LEFT JOIN warehouses w ON r.warehouse_id = w.id
    LEFT JOIN users u ON r.created_by = u.id
    WHERE 1=1
  `;
  const params = [];
  if (filters.warehouse_id) {
    sql += ' AND r.warehouse_id = ?';
    params.push(filters.warehouse_id);
  }
  if (filters.from_date) {
    sql += ' AND r.receipt_date >= ?';
    params.push(filters.from_date);
  }
  if (filters.to_date) {
    sql += ' AND r.receipt_date <= ?';
    params.push(filters.to_date);
  }
  sql += ' ORDER BY r.receipt_date DESC, r.id DESC';
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
    `SELECT r.*, w.name AS warehouse_name, u.name AS created_by_name
     FROM receipts r
     LEFT JOIN warehouses w ON r.warehouse_id = w.id
     LEFT JOIN users u ON r.created_by = u.id
     WHERE r.id = ?`,
    [id]
  );
  return rows[0];
};

const create = async (warehouseId, receiptDate, notes, createdBy) => {
  const result = await query(
    'INSERT INTO receipts (warehouse_id, receipt_date, notes, created_by) VALUES (?, ?, ?, ?)',
    [warehouseId, receiptDate, notes || '', createdBy]
  );
  return result.insertId;
};

const remove = async (id) => {
  await query('DELETE FROM receipt_items WHERE receipt_id = ?', [id]);
  await query('DELETE FROM receipts WHERE id = ?', [id]);
  return id;
};

module.exports = { getAll, getById, create, remove };
