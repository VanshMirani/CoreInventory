const receiptService = require('../services/receiptService');
const receiptModel = require('../models/receiptModel');
const { buildDateFilters } = require('../utils/filterBuilder');

const getAll = async (req, res, next) => {
  try {
    const filters = buildDateFilters(req.query);
    const receipts = await receiptModel.getAll(filters);
    res.json(receipts);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const receipt = await receiptService.getReceiptWithItems(req.params.id);
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }
    res.json(receipt);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { warehouse_id, receipt_date, notes, items } = req.body;
    if (!warehouse_id || !receipt_date || !items?.length) {
      return res.status(400).json({ message: 'Warehouse, receipt date and items are required' });
    }
    const id = await receiptService.createReceiptWithItems(
      warehouse_id,
      receipt_date,
      notes,
      items,
      req.user?.id
    );
    const receipt = await receiptService.getReceiptWithItems(id);
    res.status(201).json(receipt);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await receiptService.deleteReceiptWithRollback(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, remove };
