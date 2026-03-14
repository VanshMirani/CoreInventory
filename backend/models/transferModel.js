const { query } = require('../config/db');

const getAll = async (filters = {}) => {
  let sql = `
    SELECT t.*,
           w_from.name AS from_warehouse_name, w_to.name AS to_warehouse_name,
           p.name AS product_name, p.sku, u.name AS created_by_name
    FROM transfers t
    JOIN warehouses w_from ON t.from_warehouse_id = w_from.id
    JOIN warehouses w_to ON t.to_warehouse_id = w_to.id
    JOIN products p ON t.product_id = p.id
    LEFT JOIN users u ON t.created_by = u.id
    WHERE 1=1
  `;
  const params = [];
  if (filters.warehouse_id) {
    sql += ' AND (t.from_warehouse_id = ? OR t.to_warehouse_id = ?)';
    params.push(filters.warehouse_id, filters.warehouse_id);
  }
  if (filters.from_date) {
    sql += ' AND t.transfer_date >= ?';
    params.push(filters.from_date);
  }
  if (filters.to_date) {
    sql += ' AND t.transfer_date <= ?';
    params.push(filters.to_date);
  }
  sql += ' ORDER BY t.transfer_date DESC, t.id DESC';
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
    `SELECT t.*,
            w_from.name AS from_warehouse_name, w_to.name AS to_warehouse_name,
            p.name AS product_name, p.sku, u.name AS created_by_name
     FROM transfers t
     JOIN warehouses w_from ON t.from_warehouse_id = w_from.id
     JOIN warehouses w_to ON t.to_warehouse_id = w_to.id
     JOIN products p ON t.product_id = p.id
     LEFT JOIN users u ON t.created_by = u.id
     WHERE t.id = ?`,
    [id]
  );
  return rows[0];
};

const create = async (fromWarehouseId, toWarehouseId, productId, quantity, transferDate, notes, createdBy) => {
  const result = await query(
    `INSERT INTO transfers (from_warehouse_id, to_warehouse_id, product_id, quantity, transfer_date, notes, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [fromWarehouseId, toWarehouseId, productId, quantity, transferDate, notes || '', createdBy]
  );
  return result.insertId;
};

const remove = async (id) => {
  await query('DELETE FROM transfers WHERE id = ?', [id]);
  return id;
};

module.exports = { getAll, getById, create, remove };
