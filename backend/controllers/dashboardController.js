const dashboardService = require('../services/dashboardService');

const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

const getRecentActivity = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const activity = await dashboardService.getRecentActivity(limit);
    res.json(activity);
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats, getRecentActivity };
