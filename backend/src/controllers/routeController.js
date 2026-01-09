import { getOptimizedRoute } from "../service/routeService.js";

export const optimizeRoute = async (req, res) => {
  const { start, end } = req.body;

  const route = await getOptimizedRoute(start, end);

  res.status(200).json({
    success: true,
    route,
  });
};
