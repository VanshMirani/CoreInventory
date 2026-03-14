const notificationService = require('../services/notificationService');

const getLowStock = async (req, res, next) => {
  try {
    const warehouseId = req.query.warehouse_id || null;
    const alerts = await notificationService.getLowStockAlerts(warehouseId);
    res.json(alerts);
  } catch (err) {
    next(err);
  }
};

module.exports = { getLowStock };
