const { query } = require('../config/db');

const getAll = async (filters = {}) => {
  let sql = `
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;
  const params = [];
  if (filters.category_id) {
    sql += ' AND p.category_id = ?';
    params.push(filters.category_id);
  }
  if (filters.search) {
    sql += ' AND (p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ?)';
    const term = `%${filters.search}%`;
    params.push(term, term, term);
  }
  sql += ' ORDER BY p.name';
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
    'SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
    [id]
  );
  return rows[0];
};

const getBySku = async (sku, excludeId = null) => {
  let sql = 'SELECT * FROM products WHERE sku = ?';
  const params = [sku];
  if (excludeId) {
    sql += ' AND id != ?';
    params.push(excludeId);
  }
  const rows = await query(sql, params);
  return rows[0];
};

const create = async (data) => {
  const result = await query(
    `INSERT INTO products (name, sku, description, category_id, unit_price, min_stock_level, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.sku,
      data.description || '',
      data.category_id || null,
      data.unit_price || 0,
      data.min_stock_level || 0,
      data.created_by || null,
    ]
  );
  return result.insertId;
};

const update = async (id, data) => {
  await query(
    `UPDATE products SET name = ?, description = ?, category_id = ?, unit_price = ?, min_stock_level = ?
     WHERE id = ?`,
    [
      data.name,
      data.description || '',
      data.category_id || null,
      data.unit_price ?? 0,
      data.min_stock_level ?? 0,
      id,
    ]
  );
  return id;
};

const remove = async (id) => {
  await query('DELETE FROM products WHERE id = ?', [id]);
  return id;
};

const count = async (filters = {}) => {
  let sql = 'SELECT COUNT(*) AS total FROM products WHERE 1=1';
  const params = [];
  if (filters.category_id) {
    sql += ' AND category_id = ?';
    params.push(filters.category_id);
  }
  if (filters.search) {
    sql += ' AND (name LIKE ? OR sku LIKE ? OR description LIKE ?)';
    const term = `%${filters.search}%`;
    params.push(term, term, term);
  }
  const rows = await query(sql, params);
  return rows[0].total;
};

module.exports = { getAll, getById, getBySku, create, update, remove, count };
