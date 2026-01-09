import axios from "axios";

export const getOptimizedRoute = async ({ start, end, context }) => {
  const res = await axios.post(
    "http://localhost:8000/optimize-route",
    {
      start_lat: start.lat,
      start_lng: start.lng,
      end_lat: end.lat,
      end_lng: end.lng,
      context,
    }
  );

  return res.data;
};
