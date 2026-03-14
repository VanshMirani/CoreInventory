import api from './api';

export function getStats() {
  return api.get('/dashboard/stats').then((res) => res.data);
}

export function getActivity(limit = 10) {
  return api.get('/dashboard/activity', { params: { limit } }).then((res) => res.data);
}

export default { getStats, getActivity };
