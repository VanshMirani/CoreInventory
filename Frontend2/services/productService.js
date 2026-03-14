import api from './api';

export function getProducts(params = {}) {
  return api.get('/products', { params }).then((res) => res.data);
}

export function getProduct(id) {
  return api.get(`/products/${id}`).then((res) => res.data);
}

export function createProduct(data) {
  return api.post('/products', data).then((res) => res.data);
}

export function updateProduct(id, data) {
  return api.put(`/products/${id}`, data).then((res) => res.data);
}

export function deleteProduct(id) {
  return api.delete(`/products/${id}`);
}

export function generateSku(prefix) {
  return api.get('/products/generate-sku', { params: { prefix } }).then((res) => res.data.sku);
}

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  generateSku,
};
