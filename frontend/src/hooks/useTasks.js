import { useState, useEffect } from 'react';
import { fetchTasks } from '../api';

function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}

export function useTasks(query, status, page, pageSize) {
  const debouncedQuery = useDebouncedValue(query, 300);
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchTasks({ query: debouncedQuery, status, page, pageSize, signal: controller.signal })
      .then((data) => {
        setTasks(data.items ?? []);
        setTotal(data.total ?? 0);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          return;
        }
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [debouncedQuery, status, page, pageSize]);

  return { tasks, total, loading, error };
}
