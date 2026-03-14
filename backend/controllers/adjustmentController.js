const adjustmentModel = require('../models/adjustmentModel');
const inventoryModel = require('../models/inventoryModel');
const { buildDateFilters } = require('../utils/filterBuilder');

const getAll = async (req, res, next) => {
  try {
    const filters = buildDateFilters(req.query);
    const adjustments = await adjustmentModel.getAll(filters);
    res.json(adjustments);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const adjustment = await adjustmentModel.getById(req.params.id);
    if (!adjustment) {
      return res.status(404).json({ message: 'Adjustment not found' });
    }
    res.json(adjustment);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { warehouse_id, product_id, quantity_change, reason, adjustment_date } = req.body;
    if (!warehouse_id || !product_id || quantity_change === undefined || quantity_change === null) {
      return res.status(400).json({ message: 'Warehouse, product and quantity change are required' });
    }
    const inv = await inventoryModel.getByWarehouseAndProduct(warehouse_id, product_id);
    const currentQty = inv ? inv.quantity : 0;
    const newQty = currentQty + parseInt(quantity_change, 10);
    if (newQty < 0) {
      return res.status(400).json({ message: 'Adjustment would result in negative stock' });
    }
    const date = adjustment_date || new Date().toISOString().slice(0, 10);
    await inventoryModel.setQuantity(warehouse_id, product_id, newQty);
    const movementModel = require('../models/movementModel');
    await movementModel.create(
      warehouse_id,
      product_id,
      quantity_change >= 0 ? 'in' : 'out',
      quantity_change,
      'adjustment',
      null,
      date,
      req.user?.id
    );
    const id = await adjustmentModel.create(
      warehouse_id,
      product_id,
      quantity_change,
      reason || '',
      date,
      req.user?.id
    );
    const adjustment = await adjustmentModel.getById(id);
    res.status(201).json(adjustment);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await adjustmentModel.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, remove };
