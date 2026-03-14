const { query } = require('../config/db');

const getLowStockItems = async (warehouseId = null) => {
  let sql = `
    SELECT i.*, p.name AS product_name, p.sku, p.min_stock_level, w.name AS warehouse_name
    FROM inventory i
    JOIN products p ON i.product_id = p.id
    JOIN warehouses w ON i.warehouse_id = w.id
    WHERE p.min_stock_level > 0 AND i.quantity <= p.min_stock_level
  `;
  const params = [];
  if (warehouseId) {
    sql += ' AND i.warehouse_id = ?';
    params.push(warehouseId);
  }
  sql += ' ORDER BY i.quantity ASC';
  return query(sql, params);
};

module.exports = { getLowStockItems };
