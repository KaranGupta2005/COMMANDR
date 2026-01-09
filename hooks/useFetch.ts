import axios from "axios";
import { useEffect, useState } from "react";

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(url, {
          ...options,
          signal: controller.signal,
        });

        setData(res.data);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Some error occurred. Please try again."
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
