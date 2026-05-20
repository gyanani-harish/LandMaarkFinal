import { useState, useEffect, useCallback } from "react";
import { Township } from "../store/TownShip/TownshipTypes";
import { fetchTownships } from "../services/TownshipService";

export const useTownships = () => {
  const [townships, setTownships] = useState<Township[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadTownships = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchTownships();
      setTownships(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTownships();
  }, [loadTownships]);

  return { townships, loading, error, retry: loadTownships };
};