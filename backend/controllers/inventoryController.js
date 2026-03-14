const inventoryService = require('../services/inventoryService');

const getAll = async (req, res, next) => {
  try {
    const filters = {
      warehouse_id: req.query.warehouse_id,
      product_id: req.query.product_id,
      low_stock: req.query.low_stock === 'true',
    };
    const inventory = await inventoryService.getInventory(filters);
    res.json(inventory);
  } catch (err) {
    next(err);
  }
};

const getByWarehouse = async (req, res, next) => {
  try {
    const filters = { low_stock: req.query.low_stock === 'true' };
    const inventory = await inventoryService.getInventoryByWarehouse(req.params.warehouseId, filters);
    res.json(inventory);
  } catch (err) {
    next(err);
  }
};

const getByProduct = async (req, res, next) => {
  try {
    const inventory = await inventoryService.getInventoryByProduct(req.params.productId);
    res.json(inventory);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getByWarehouse, getByProduct };
