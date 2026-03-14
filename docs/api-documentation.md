# Electrostock API Documentation

Base URL: `http://localhost:5000/api` (or your `PORT`).

All endpoints except `POST /auth/register` and `POST /auth/login` require:

```
Authorization: Bearer <jwt_token>
```

---

## Auth

### Register
`POST /auth/register`

Body:
```json
{ "name": "John", "email": "john@example.com", "password": "secret" }
```

Response: `{ "user": { ... }, "token": "..." }`

### Login
`POST /auth/login`

Body:
```json
{ "email": "john@example.com", "password": "secret" }
```

Response: `{ "user": { ... }, "token": "..." }`

### Me
`GET /auth/me`

Response: `{ "id", "name", "email", "role", "created_at" }`

---

## Dashboard

### Stats
`GET /dashboard/stats`

Response: `{ "totalProducts", "totalWarehouses", "totalReceipts", "totalDeliveries", "lowStockCount", "totalInventoryValue" }`

### Activity
`GET /dashboard/activity?limit=10`

Response: `[ { "id", "type", "date", "warehouse_id" }, ... ]`

---

## Products

- `GET /products?search=&category_id=&limit=50&offset=0` → `{ "products", "total" }`
- `GET /products/generate-sku?prefix=ELEC` → `{ "sku" }`
- `GET /products/:id` → product
- `POST /products` → body: `{ "name", "sku?", "description?", "category_id?", "unit_price?", "min_stock_level?" }`
- `PUT /products/:id` → same body
- `DELETE /products/:id` → 204

---

## Categories

- `GET /categories` → array
- `GET /categories/:id` → category
- `POST /categories` → body: `{ "name", "description?" }`
- `PUT /categories/:id` → same body
- `DELETE /categories/:id` → 204

---

## Warehouses

- `GET /warehouses` → array
- `GET /warehouses/:id` → warehouse
- `POST /warehouses` → body: `{ "name", "location", "description?" }`
- `PUT /warehouses/:id` → same body
- `DELETE /warehouses/:id` → 204

---

## Inventory

- `GET /inventory?warehouse_id=&product_id=&low_stock=true` → array of inventory rows (with product/warehouse names)
- `GET /inventory/warehouse/:warehouseId?low_stock=true` → array
- `GET /inventory/product/:productId` → array

---

## Receipts

- `GET /receipts?warehouse_id=&from_date=&to_date=&limit=&offset=` → array
- `GET /receipts/:id` → receipt with `items[]`
- `POST /receipts` → body: `{ "warehouse_id", "receipt_date", "notes?", "items": [ { "product_id", "quantity", "unit_price?" } ] }`
- `DELETE /receipts/:id` → 204 (reverses stock)

---

## Deliveries

- `GET /deliveries?warehouse_id=&from_date=&to_date=&limit=&offset=` → array
- `GET /deliveries/:id` → delivery with `items[]`
- `POST /deliveries` → body: `{ "warehouse_id", "delivery_date", "customer_name?", "notes?", "items": [ { "product_id", "quantity", "unit_price?" } ] }`
- `DELETE /deliveries/:id` → 204

---

## Transfers

- `GET /transfers?warehouse_id=&from_date=&to_date=&limit=&offset=` → array
- `GET /transfers/:id` → transfer
- `POST /transfers` → body: `{ "from_warehouse_id", "to_warehouse_id", "product_id", "quantity", "transfer_date?", "notes?" }`
- `DELETE /transfers/:id` → 204

---

## Adjustments

- `GET /adjustments?warehouse_id=&from_date=&to_date=&limit=&offset=` → array
- `GET /adjustments/:id` → adjustment
- `POST /adjustments` → body: `{ "warehouse_id", "product_id", "quantity_change", "reason?", "adjustment_date?" }`
- `DELETE /adjustments/:id` → 204

---

## Movements

- `GET /movements?warehouse_id=&product_id=&movement_type=&from_date=&to_date=&limit=&offset=` → array

---

## Alerts

- `GET /alerts/low-stock?warehouse_id=` → array of low-stock items

---

## Search

- `GET /search?q=...` → `{ "products", "categories", "warehouses" }`
