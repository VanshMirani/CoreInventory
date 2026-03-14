const productModel = require('../models/productModel');
const { buildProductFilters } = require('../utils/filterBuilder');
const { generateSku } = require('../utils/skuGenerator');
const receiptService = require('../services/receiptService');

const getAll = async (req, res, next) => {
  try {
    const filters = buildProductFilters(req.query);
    const [products, total] = await Promise.all([
      productModel.getAll(filters),
      productModel.count(filters),
    ]);
    res.json({ products, total });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const product = await productModel.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const data = { ...req.body, created_by: req.user?.id };
    if (!data.sku) {
      data.sku = await generateSku();
    }
    if (data.sku) {
      const existing = await productModel.getBySku(data.sku);
      if (existing) {
        return res.status(400).json({ message: 'SKU already exists' });
      }
    }
    const id = await productModel.create(data);
    if (data.initial_warehouse_id && parseInt(data.initial_quantity) > 0) {
      await receiptService.createReceiptWithItems(
        parseInt(data.initial_warehouse_id),
        new Date().toISOString().slice(0, 10),
        `Initial stock receipt for ${data.name}`,
        [{
          product_id: id,
          quantity: parseInt(data.initial_quantity),
          unit_price: data.unit_price || 0
        }],
        data.created_by
      );
    }
    const product = await productModel.getById(id);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const product = await productModel.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (req.body.sku && req.body.sku !== product.sku) {
      const existing = await productModel.getBySku(req.body.sku, product.id);
      if (existing) {
        return res.status(400).json({ message: 'SKU already exists' });
      }
    }
    await productModel.update(req.params.id, req.body);
    const updated = await productModel.getById(req.params.id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const product = await productModel.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await productModel.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const generateSkuRoute = async (req, res, next) => {
  try {
    const sku = await generateSku(req.query.prefix || 'ELEC');
    res.json({ sku });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove, generateSkuRoute };
