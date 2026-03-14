const { query } = require('../config/db');

const getByDeliveryId = async (deliveryId) => {
  return query(
    `SELECT di.*, p.name AS product_name, p.sku
     FROM delivery_items di
     JOIN products p ON di.product_id = p.id
     WHERE di.delivery_id = ?
     ORDER BY p.name`,
    [deliveryId]
  );
};

const create = async (deliveryId, productId, quantity, unitPrice) => {
  const result = await query(
    'INSERT INTO delivery_items (delivery_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
    [deliveryId, productId, quantity, unitPrice || 0]
  );
  return result.insertId;
};

const removeByDeliveryId = async (deliveryId) => {
  await query('DELETE FROM delivery_items WHERE delivery_id = ?', [deliveryId]);
  return deliveryId;
};

module.exports = { getByDeliveryId, create, removeByDeliveryId };
