const inventoryModel = require('../models/inventoryModel');
const { buildDateFilters } = require('../utils/filterBuilder');

const getInventory = async (filters = {}) => {
  return inventoryModel.getAll(filters);
};

const getInventoryByWarehouse = async (warehouseId, filters = {}) => {
  return inventoryModel.getByWarehouse(warehouseId, filters);
};

const getInventoryByProduct = async (productId) => {
  return inventoryModel.getByProduct(productId);
};

module.exports = { getInventory, getInventoryByWarehouse, getInventoryByProduct };
