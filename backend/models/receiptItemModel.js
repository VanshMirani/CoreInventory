const { query } = require('../config/db');

const getByReceiptId = async (receiptId) => {
  return query(
    `SELECT ri.*, p.name AS product_name, p.sku
     FROM receipt_items ri
     JOIN products p ON ri.product_id = p.id
     WHERE ri.receipt_id = ?
     ORDER BY p.name`,
    [receiptId]
  );
};

const create = async (receiptId, productId, quantity, unitPrice) => {
  const result = await query(
    'INSERT INTO receipt_items (receipt_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
    [receiptId, productId, quantity, unitPrice || 0]
  );
  return result.insertId;
};

const removeByReceiptId = async (receiptId) => {
  await query('DELETE FROM receipt_items WHERE receipt_id = ?', [receiptId]);
  return receiptId;
};

module.exports = { getByReceiptId, create, removeByReceiptId };
