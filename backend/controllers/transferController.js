const transferModel = require('../models/transferModel');
const { addStock, removeStock } = require('../utils/stockUpdater');
const { buildDateFilters } = require('../utils/filterBuilder');

const getAll = async (req, res, next) => {
  try {
    const filters = buildDateFilters(req.query);
    const transfers = await transferModel.getAll(filters);
    res.json(transfers);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const transfer = await transferModel.getById(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: 'Transfer not found' });
    }
    res.json(transfer);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { from_warehouse_id, to_warehouse_id, product_id, quantity, transfer_date, notes } = req.body;
    if (!from_warehouse_id || !to_warehouse_id || !product_id || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'From warehouse, to warehouse, product and positive quantity required' });
    }
    if (from_warehouse_id === to_warehouse_id) {
      return res.status(400).json({ message: 'Source and destination warehouses must be different' });
    }
    const date = transfer_date || new Date().toISOString().slice(0, 10);
    await removeStock(
      from_warehouse_id,
      product_id,
      quantity,
      'transfer',
      null,
      date,
      req.user?.id
    );
    await addStock(to_warehouse_id, product_id, quantity, 'transfer', null, date, req.user?.id);
    const id = await transferModel.create(
      from_warehouse_id,
      to_warehouse_id,
      product_id,
      quantity,
      date,
      notes,
      req.user?.id
    );
    const transfer = await transferModel.getById(id);
    res.status(201).json(transfer);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await transferModel.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, remove };
