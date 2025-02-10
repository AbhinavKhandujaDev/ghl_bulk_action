import controller from "@/controllers";
import { typeService } from "@/services";
import redisService from "@/services/redisService";

export const validateRateLimit = controller(async (_, __, next) => {
  const userId = "def-ip";

  const count = await redisService.incr(userId);
  if (count === 1) redisService.expire(userId, 60);

  if (count > 3) throw Error("Too many requests per minute");

  next();
});

export const validateParamsAvailable = controller(async (req, _, next) => {
  const { action, actData } = req.body;
  if (!action) throw Error("action not found");
  if (!actData?.length) throw Error("actData is missing");
  next();
});

export const validateActionAvailable = controller(async (req, _, next) => {
  const { action } = req.body;
  const type = await typeService.findByType(action);
  if (!type) throw Error("Invalid action");
  next();
});
