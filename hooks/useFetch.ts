"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api/client";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const useFetch = <T = any>(url: string): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await apiClient.get(url, {
          signal: controller.signal,
        });

        setData(res.data);
      } catch (err: any) {
        if (err.name !== "CanceledError") {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Something went wrong"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
