const { query } = require('../config/db');

const getByWarehouseAndProduct = async (warehouseId, productId) => {
  const rows = await query(
    'SELECT * FROM inventory WHERE warehouse_id = ? AND product_id = ?',
    [warehouseId, productId]
  );
  return rows[0];
};

const getByWarehouse = async (warehouseId, filters = {}) => {
  let sql = `
    SELECT i.*, p.name AS product_name, p.sku, p.unit_price, c.name AS category_name
    FROM inventory i
    JOIN products p ON i.product_id = p.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE i.warehouse_id = ?
  `;
  const params = [warehouseId];
  if (filters.low_stock) {
    sql += ' AND i.quantity <= p.min_stock_level AND p.min_stock_level > 0';
  }
  sql += ' ORDER BY p.name';
  return query(sql, params);
};

const getByProduct = async (productId) => {
  return query(
    `SELECT i.*, w.name AS warehouse_name, w.location
     FROM inventory i
     JOIN warehouses w ON i.warehouse_id = w.id
     WHERE i.product_id = ?
     ORDER BY w.name`,
    [productId]
  );
};

const getAll = async (filters = {}) => {
  let sql = `
    SELECT i.*, p.name AS product_name, p.sku, p.unit_price, p.min_stock_level,
           w.name AS warehouse_name, w.location, c.name AS category_name
    FROM inventory i
    JOIN products p ON i.product_id = p.id
    JOIN warehouses w ON i.warehouse_id = w.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;
  const params = [];
  if (filters.warehouse_id) {
    sql += ' AND i.warehouse_id = ?';
    params.push(filters.warehouse_id);
  }
  if (filters.product_id) {
    sql += ' AND i.product_id = ?';
    params.push(filters.product_id);
  }
  if (filters.low_stock) {
    sql += ' AND i.quantity <= p.min_stock_level AND p.min_stock_level > 0';
  }
  sql += ' ORDER BY w.name, p.name';
  return query(sql, params);
};

const upsert = async (warehouseId, productId, quantity) => {
  const existing = await getByWarehouseAndProduct(warehouseId, productId);
  if (existing) {
    await query(
      'UPDATE inventory SET quantity = quantity + ? WHERE warehouse_id = ? AND product_id = ?',
      [quantity, warehouseId, productId]
    );
  } else {
    await query(
      'INSERT INTO inventory (warehouse_id, product_id, quantity) VALUES (?, ?, ?)',
      [warehouseId, productId, quantity]
    );
  }
  return getByWarehouseAndProduct(warehouseId, productId);
};

const setQuantity = async (warehouseId, productId, quantity) => {
  const existing = await getByWarehouseAndProduct(warehouseId, productId);
  if (existing) {
    await query(
      'UPDATE inventory SET quantity = ? WHERE warehouse_id = ? AND product_id = ?',
      [quantity, warehouseId, productId]
    );
  } else {
    await query(
      'INSERT INTO inventory (warehouse_id, product_id, quantity) VALUES (?, ?, ?)',
      [warehouseId, productId, quantity]
    );
  }
  return getByWarehouseAndProduct(warehouseId, productId);
};

const getTotalByProduct = async (productId) => {
  const rows = await query(
    'SELECT COALESCE(SUM(quantity), 0) AS total FROM inventory WHERE product_id = ?',
    [productId]
  );
  return rows[0].total;
};

module.exports = {
  getByWarehouseAndProduct,
  getByWarehouse,
  getByProduct,
  getAll,
  upsert,
  setQuantity,
  getTotalByProduct,
};
