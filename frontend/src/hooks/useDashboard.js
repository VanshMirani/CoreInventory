import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService';

export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      dashboardService.getStats(),
      dashboardService.getActivity(10),
    ])
      .then(([s, a]) => {
        if (!cancelled) {
          setStats(s);
          setActivity(a);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load dashboard');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { stats, activity, loading, error };
}
