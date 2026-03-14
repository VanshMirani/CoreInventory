const receiptModel = require('../models/receiptModel');
const receiptItemModel = require('../models/receiptItemModel');
const inventoryModel = require('../models/inventoryModel');
const movementModel = require('../models/movementModel');
const { addStock } = require('../utils/stockUpdater');

const createReceiptWithItems = async (warehouseId, receiptDate, notes, items, createdBy) => {
  const receiptId = await receiptModel.create(warehouseId, receiptDate, notes, createdBy);
  for (const item of items) {
    await receiptItemModel.create(receiptId, item.product_id, item.quantity, item.unit_price);
    await addStock(
      warehouseId,
      item.product_id,
      item.quantity,
      'receipt',
      receiptId,
      receiptDate,
      createdBy
    );
  }
  return receiptId;
};

const getReceiptWithItems = async (id) => {
  const receipt = await receiptModel.getById(id);
  if (!receipt) return null;
  receipt.items = await receiptItemModel.getByReceiptId(id);
  return receipt;
};

const deleteReceiptWithRollback = async (id) => {
  const receipt = await receiptModel.getById(id);
  if (!receipt) return null;
  const items = await receiptItemModel.getByReceiptId(id);
  for (const item of items) {
    const inv = await inventoryModel.getByWarehouseAndProduct(receipt.warehouse_id, item.product_id);
    if (inv) {
      const newQty = Math.max(0, inv.quantity - item.quantity);
      await inventoryModel.setQuantity(receipt.warehouse_id, item.product_id, newQty);
    }
  }
  await receiptModel.remove(id);
  return id;
};

module.exports = { createReceiptWithItems, getReceiptWithItems, deleteReceiptWithRollback };
