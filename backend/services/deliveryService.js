const deliveryModel = require('../models/deliveryModel');
const deliveryItemModel = require('../models/deliveryItemModel');
const inventoryModel = require('../models/inventoryModel');
const { removeStock } = require('../utils/stockUpdater');

const createDeliveryWithItems = async (warehouseId, deliveryDate, customerName, notes, items, createdBy) => {
  const deliveryId = await deliveryModel.create(warehouseId, deliveryDate, customerName, notes, createdBy);
  for (const item of items) {
    await removeStock(
      warehouseId,
      item.product_id,
      item.quantity,
      'delivery',
      deliveryId,
      deliveryDate,
      createdBy
    );
    await deliveryItemModel.create(deliveryId, item.product_id, item.quantity, item.unit_price);
  }
  return deliveryId;
};

const getDeliveryWithItems = async (id) => {
  const delivery = await deliveryModel.getById(id);
  if (!delivery) return null;
  delivery.items = await deliveryItemModel.getByDeliveryId(id);
  return delivery;
};

module.exports = { createDeliveryWithItems, getDeliveryWithItems };
