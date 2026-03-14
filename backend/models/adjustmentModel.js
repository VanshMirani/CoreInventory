const { query } = require('../config/db');

const getAll = async (filters = {}) => {
  let sql = `
    SELECT a.*, w.name AS warehouse_name, p.name AS product_name, p.sku, u.name AS created_by_name
    FROM adjustments a
    JOIN warehouses w ON a.warehouse_id = w.id
    JOIN products p ON a.product_id = p.id
    LEFT JOIN users u ON a.created_by = u.id
    WHERE 1=1
  `;
  const params = [];
  if (filters.warehouse_id) {
    sql += ' AND a.warehouse_id = ?';
    params.push(filters.warehouse_id);
  }
  if (filters.from_date) {
    sql += ' AND a.adjustment_date >= ?';
    params.push(filters.from_date);
  }
  if (filters.to_date) {
    sql += ' AND a.adjustment_date <= ?';
    params.push(filters.to_date);
  }
  sql += ' ORDER BY a.adjustment_date DESC, a.id DESC';
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
    `SELECT a.*, w.name AS warehouse_name, p.name AS product_name, p.sku, u.name AS created_by_name
     FROM adjustments a
     JOIN warehouses w ON a.warehouse_id = w.id
     JOIN products p ON a.product_id = p.id
     LEFT JOIN users u ON a.created_by = u.id
     WHERE a.id = ?`,
    [id]
  );
  return rows[0];
};

const create = async (warehouseId, productId, quantityChange, reason, adjustmentDate, createdBy) => {
  const result = await query(
    `INSERT INTO adjustments (warehouse_id, product_id, quantity_change, reason, adjustment_date, created_by)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [warehouseId, productId, quantityChange, reason || '', adjustmentDate, createdBy]
  );
  return result.insertId;
};

const remove = async (id) => {
  await query('DELETE FROM adjustments WHERE id = ?', [id]);
  return id;
};

module.exports = { getAll, getById, create, remove };
