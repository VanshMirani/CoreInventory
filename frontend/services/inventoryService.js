import api from './api';

export function getInventory(params = {}) {
  return api.get('/inventory', { params }).then((res) => res.data);
}

export function getInventoryByWarehouse(warehouseId, params = {}) {
  return api.get(`/inventory/warehouse/${warehouseId}`, { params }).then((res) => res.data);
}

export function getInventoryByProduct(productId) {
  return api.get(`/inventory/product/${productId}`).then((res) => res.data);
}

export default { getInventory, getInventoryByWarehouse, getInventoryByProduct };
