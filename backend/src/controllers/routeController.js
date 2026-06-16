import { getOptimizedRoute } from "../service/routeService.js";
import ExpressError from "../middlewares/expressError.js";

export const optimizeRoute = async (req, res, next) => {
  try {
    const { start, end, context } = req.body;

    if (!start?.lat || !start?.lng || !end?.lat || !end?.lng) {
      throw new ExpressError(400, "start and end locations (lat, lng) are required");
    }

    const route = await getOptimizedRoute({ start, end, context: context || {} });

    res.status(200).json({
      success: true,
      route,
    });
  } catch (err) {
    next(err);
  }
};
