-- Common queries for Electrostock

-- Dashboard: total inventory value
SELECT COALESCE(SUM(i.quantity * p.unit_price), 0) AS total_value
FROM inventory i
JOIN products p ON i.product_id = p.id;

-- Low stock items
SELECT i.*, p.name AS product_name, p.sku, p.min_stock_level, w.name AS warehouse_name
FROM inventory i
JOIN products p ON i.product_id = p.id
JOIN warehouses w ON i.warehouse_id = w.id
WHERE p.min_stock_level > 0 AND i.quantity <= p.min_stock_level
ORDER BY i.quantity ASC;

-- Receipts in date range
SELECT r.*, w.name AS warehouse_name
FROM receipts r
JOIN warehouses w ON r.warehouse_id = w.id
WHERE r.receipt_date BETWEEN ? AND ?
ORDER BY r.receipt_date DESC;

-- Product stock across warehouses
SELECT w.name AS warehouse_name, i.quantity, p.name AS product_name, p.sku
FROM inventory i
JOIN warehouses w ON i.warehouse_id = w.id
JOIN products p ON i.product_id = p.id
WHERE p.id = ?
ORDER BY w.name;

-- Movement history for a product
SELECT m.*, w.name AS warehouse_name
FROM stock_movements m
LEFT JOIN warehouses w ON m.warehouse_id = w.id
WHERE m.product_id = ?
ORDER BY m.movement_date DESC, m.id DESC
LIMIT 50;
