const productModel = require('../models/productModel');
const { query } = require('../config/db');

const search = async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) {
      return res.json({ products: [], categories: [], warehouses: [] });
    }
    const term = `%${q}%`;
    const [products, categories, warehouses] = await Promise.all([
      productModel.getAll({ search: q, limit: 20 }),
      query('SELECT id, name FROM categories WHERE name LIKE ? LIMIT 10', [term]),
      query('SELECT id, name, location FROM warehouses WHERE name LIKE ? OR location LIKE ? LIMIT 10', [term, term]),
    ]);
    res.json({ products, categories, warehouses });
  } catch (err) {
    next(err);
  }
};

module.exports = { search };
