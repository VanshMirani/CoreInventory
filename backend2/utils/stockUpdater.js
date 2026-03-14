const inventoryModel = require('../models/inventoryModel');
const movementModel = require('../models/movementModel');

const addStock = async (warehouseId, productId, quantity, referenceType, referenceId, movementDate, userId) => {
  await inventoryModel.upsert(warehouseId, productId, quantity);
  await movementModel.create(
    warehouseId,
    productId,
    'in',
    quantity,
    referenceType,
    referenceId,
    movementDate,
    userId
  );
};

const removeStock = async (warehouseId, productId, quantity, referenceType, referenceId, movementDate, userId) => {
  const inv = await inventoryModel.getByWarehouseAndProduct(warehouseId, productId);
  const currentQty = inv ? inv.quantity : 0;
  const newQty = Math.max(0, currentQty - quantity);
  await inventoryModel.setQuantity(warehouseId, productId, newQty);
  await movementModel.create(
    warehouseId,
    productId,
    'out',
    -quantity,
    referenceType,
    referenceId,
    movementDate,
    userId
  );
};

module.exports = { addStock, removeStock };
