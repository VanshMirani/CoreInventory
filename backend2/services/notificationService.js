const { getLowStockItems } = require('../utils/lowStockChecker');

const getLowStockAlerts = async (warehouseId = null) => {
  const items = await getLowStockItems(warehouseId);
  return items.map((item) => ({
    id: item.id,
    product_id: item.product_id,
    product_name: item.product_name,
    sku: item.sku,
    warehouse_id: item.warehouse_id,
    warehouse_name: item.warehouse_name,
    quantity: item.quantity,
    min_stock_level: item.min_stock_level,
    deficit: item.min_stock_level - item.quantity,
  }));
};

module.exports = { getLowStockAlerts };
