const warehouseModel = require('../models/warehouseModel');

const getAll = async (req, res, next) => {
  try {
    const warehouses = await warehouseModel.getAll();
    res.json(warehouses);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const warehouse = await warehouseModel.getById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    res.json(warehouse);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, location, description } = req.body;
    if (!name || !location) {
      return res.status(400).json({ message: 'Name and location are required' });
    }
    const id = await warehouseModel.create(name, location, description);
    const warehouse = await warehouseModel.getById(id);
    res.status(201).json(warehouse);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const warehouse = await warehouseModel.getById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    const { name, location, description } = req.body;
    await warehouseModel.update(
      req.params.id,
      name ?? warehouse.name,
      location ?? warehouse.location,
      description ?? warehouse.description
    );
    const updated = await warehouseModel.getById(req.params.id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const warehouse = await warehouseModel.getById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    await warehouseModel.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };
