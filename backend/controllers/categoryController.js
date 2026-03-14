const categoryModel = require('../models/categoryModel');

const getAll = async (req, res, next) => {
  try {
    const categories = await categoryModel.getAll();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const category = await categoryModel.getById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const id = await categoryModel.create(name, description);
    const category = await categoryModel.getById(id);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const category = await categoryModel.getById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const { name, description } = req.body;
    await categoryModel.update(req.params.id, name ?? category.name, description ?? category.description);
    const updated = await categoryModel.getById(req.params.id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const category = await categoryModel.getById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await categoryModel.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };
