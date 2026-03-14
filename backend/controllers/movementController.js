const movementModel = require('../models/movementModel');
const { buildMovementFilters } = require('../utils/filterBuilder');

const getAll = async (req, res, next) => {
  try {
    const filters = buildMovementFilters(req.query);
    const movements = await movementModel.getAll(filters);
    res.json(movements);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll };
