import api from './api';

export function getReceipts(params = {}) {
  return api.get('/receipts', { params }).then((res) => res.data);
}

export function getReceipt(id) {
  return api.get(`/receipts/${id}`).then((res) => res.data);
}

export function createReceipt(data) {
  return api.post('/receipts', data).then((res) => res.data);
}

export function deleteReceipt(id) {
  return api.delete(`/receipts/${id}`);
}

export default { getReceipts, getReceipt, createReceipt, deleteReceipt };
