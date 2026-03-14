import api from './api';

export function getDeliveries(params = {}) {
  return api.get('/deliveries', { params }).then((res) => res.data);
}

export function getDelivery(id) {
  return api.get(`/deliveries/${id}`).then((res) => res.data);
}

export function createDelivery(data) {
  return api.post('/deliveries', data).then((res) => res.data);
}

export function deleteDelivery(id) {
  return api.delete(`/deliveries/${id}`);
}

export default { getDeliveries, getDelivery, createDelivery, deleteDelivery };
