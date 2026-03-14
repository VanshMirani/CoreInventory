const { query } = require('../config/db');
const { getLowStockItems } = require('../utils/lowStockChecker');

const getDashboardStats = async () => {
  const [products] = await query('SELECT COUNT(*) AS count FROM products');
  const [warehouses] = await query('SELECT COUNT(*) AS count FROM warehouses');
  const [receipts] = await query('SELECT COUNT(*) AS count FROM receipts');
  const [deliveries] = await query('SELECT COUNT(*) AS count FROM deliveries');
  const lowStock = await getLowStockItems();
  const [totalValue] = await query(`
    SELECT COALESCE(SUM(i.quantity * p.unit_price), 0) AS total
    FROM inventory i JOIN products p ON i.product_id = p.id
  `);
  return {
    totalProducts: products.count,
    totalWarehouses: warehouses.count,
    totalReceipts: receipts.count,
    totalDeliveries: deliveries.count,
    lowStockCount: lowStock.length,
    totalInventoryValue: parseFloat(totalValue.total) || 0,
  };
};

const getRecentActivity = async (limit = 10) => {
  const receipts = await query(
    'SELECT id, receipt_date AS date, warehouse_id FROM receipts ORDER BY receipt_date DESC LIMIT ?',
    [limit]
  );
  const deliveries = await query(
    'SELECT id, delivery_date AS date, warehouse_id FROM deliveries ORDER BY delivery_date DESC LIMIT ?',
    [limit]
  );
  const combined = [...receipts.map((r) => ({ ...r, type: 'receipt' })), ...deliveries.map((d) => ({ ...d, type: 'delivery' }))]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
  return combined;
};

module.exports = { getDashboardStats, getRecentActivity };
