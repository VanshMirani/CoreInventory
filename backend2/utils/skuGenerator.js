const productModel = require('../models/productModel');

const generateSku = async (prefix = 'ELEC') => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const sku = `${prefix}-${random}`;
  const existing = await productModel.getBySku(sku);
  if (existing) {
    return generateSku(prefix);
  }
  return sku;
};

module.exports = { generateSku };
