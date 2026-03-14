-- Seed data for Electrostock (run after schema.sql)
USE electrostock_db;

-- Admin user (password: admin123)
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin', 'admin@electrostock.com', '$2a$10$rQnM1.HVtP3b.KxYzKxYzOxYzKxYzKxYzKxYzKxYzKxYzKxYzKxYzu', 'admin')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Update with real bcrypt hash if needed. Example: bcrypt.hash('admin123', 10)
-- For quick seed, run in Node: require('bcryptjs').hashSync('admin123', 10)

-- Categories (expanded with TV, Air Conditioner, Washing Machines, Air Fryers, Laptops, Computers + originals)
INSERT INTO categories (name, description) VALUES
('Laptops', 'Notebooks and laptops'),
('Computers', 'Desktop PCs and all-in-ones'),
('TV', 'LED, OLED, Smart TVs'),
('Air Conditioner', 'Window, split, portable AC units'),
('Washing Machines', 'Top-load, front-load washers'),
('Air Fryers', 'Oil-free air frying appliances'),
('Phones & Tablets', 'Smartphones and tablets'),
('Cables & Adapters', 'USB, HDMI, power cables'),
('Accessories', 'Cases, chargers, stands'),
('Components', 'RAM, SSD, batteries')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Warehouses (added Branch1, Branch2 + originals)
INSERT INTO warehouses (name, location, description) VALUES
('Main Store', 'Downtown', 'Primary retail and storage'),
('Warehouse A', 'Industrial Park', 'Bulk storage'),
('Service Center', 'Tech Hub', 'Repairs and returns'),
('Branch1', 'North City', 'Retail branch 1'),
('Branch2', 'South City', 'Retail branch 2')
ON DUPLICATE KEY UPDATE location = VALUES(location), description = VALUES(description);

-- Products (expanded with new categories: TVs, AC, Washers, Fryers, Laptops, Computers + originals)
INSERT INTO products (name, sku, description, category_id, unit_price, min_stock_level) VALUES
-- Originals (adjusted category_ids for new order)
('USB-C Cable 2m', 'ELEC-CAB-001', 'USB-C to USB-C 2 meter', 8, 12.99, 20),
('HDMI Cable 1.5m', 'ELEC-CAB-002', 'HDMI 2.0 1.5 meter', 8, 8.99, 15),
('Laptop Stand', 'ELEC-ACC-001', 'Aluminum laptop stand', 9, 29.99, 10),
('Wireless Mouse', 'ELEC-ACC-002', 'Ergonomic wireless mouse', 9, 24.99, 25),
('SSD 500GB', 'ELEC-COM-001', 'SATA SSD 500GB', 10, 49.99, 5),
-- New for Laptops (cat 1)
('Gaming Laptop', 'ELEC-LAP-001', 'Intel i7 16GB RAM 512GB SSD', 1, 1299.99, 5),
('Office Laptop', 'ELEC-LAP-002', 'AMD Ryzen 5 8GB RAM 256GB SSD', 1, 699.99, 10),
-- New for Computers (cat 2)
('Desktop PC', 'ELEC-DESK-001', 'Intel i5 Tower 16GB 1TB HDD', 2, 899.99, 8),
('All-in-One PC', 'ELEC-AIO-001', '24-inch i3 8GB 512GB SSD', 2, 799.99, 12),
-- New for TV (cat 3)
('55-inch Smart TV', 'ELEC-TV-001', '4K LED Smart TV', 3, 599.99, 15),
('65-inch OLED TV', 'ELEC-TV-002', 'OLED 4K HDR TV', 3, 1499.99, 8),
-- New for Air Conditioner (cat 4)
('1.5 Ton Window AC', 'ELEC-AC-001', 'Window air conditioner 1.5 ton', 4, 399.99, 10),
('1 Ton Split AC', 'ELEC-AC-002', 'Split inverter AC 1 ton', 4, 499.99, 12),
-- New for Washing Machines (cat 5)
('7kg Top Load Washer', 'ELEC-WASH-001', 'Fully automatic top load 7kg', 5, 349.99, 20),
('8kg Front Load Washer', 'ELEC-WASH-002', 'Front load 8kg inverter', 5, 649.99, 15),
-- New for Air Fryers (cat 6)
('5.8L Air Fryer', 'ELEC-FRY-001', 'Digital air fryer 5.8 liter', 6, 129.99, 25),
('Hot Air Fryer', 'ELEC-FRY-002', 'Compact 4L air fryer', 6, 89.99, 30)
ON DUPLICATE KEY UPDATE unit_price = VALUES(unit_price), min_stock_level = VALUES(min_stock_level);

-- Inventory (expanded for all new warehouses 1-5 and select products 1-17)
INSERT INTO inventory (warehouse_id, product_id, quantity) VALUES
-- Warehouse 1: Main Store
(1, 1, 50), (1, 2, 30), (1, 6, 12), (1, 7, 8), (1, 11, 5), (1, 13, 3),
-- Warehouse 2: Warehouse A (bulk)
(2, 1, 100), (2, 2, 80), (2, 3, 20), (2, 4, 60), (2, 5, 12), (2, 8, 15), (2, 12, 10), (2, 14, 8),
-- Warehouse 3: Service Center
(3, 1, 20), (3, 5, 5), (3, 9, 10),
-- Warehouse 4: Branch1
(4, 6, 15), (4, 7, 10), (4, 11, 8), (4, 15, 12), (4, 17, 20),
-- Warehouse 5: Branch2
(5, 10, 6), (5, 12, 4), (5, 16, 18), (5, 14, 7)
ON DUPLICATE KEY UPDATE quantity = VALUES(quantity);
