const deliveryService = require('../services/deliveryService');
const receiptService = require('../services/receiptService');
const deliveryModel = require('../models/deliveryModel');
const { buildDateFilters } = require('../utils/filterBuilder');

const getAll = async (req, res, next) => {
  try {
    const filters = buildDateFilters(req.query);
    const deliveries = await deliveryModel.getAll(filters);
    res.json(deliveries);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const delivery = await deliveryService.getDeliveryWithItems(req.params.id);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }
    res.json(delivery);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { warehouse_id, delivery_date, customer_name, notes, items } = req.body;
    if (!warehouse_id || !delivery_date || !items?.length) {
      return res.status(400).json({ message: 'Warehouse, delivery date and items are required' });
    }
    const id = await deliveryService.createDeliveryWithItems(
      warehouse_id,
      delivery_date,
      customer_name,
      notes,
      items,
      req.user?.id
    );
    const delivery = await deliveryService.getDeliveryWithItems(id);
    await receiptService.createReceiptWithItems(
      warehouse_id,
      delivery_date,
      `Auto receipt for delivery #${id}`,
      items,
      req.user?.id
    );
    res.status(201).json(delivery);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await deliveryModel.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, remove };
