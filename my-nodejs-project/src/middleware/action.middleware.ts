import controller from "@/controllers";
import { fieldService, typeService } from "@/services";
import redisService from "@/services/redisService";

export const validateRateLimit = controller(async (_, __, next) => {
  const userId = "def-ip";

  const count = await redisService.incr(userId);
  if (count === 1) redisService.expire(userId, 60);

  if (count > 3) throw Error("Too many requests per minute");

  next();
});

export const validateParamsAvailable = controller(async (req: any, _, next) => {
  const { action, actData } = req.body;
  if (!action) throw Error("action not found");

  const fieldIds = Object.keys(actData);
  if (!fieldIds.length) throw Error("actData is missing");
  req.fieldIds = fieldIds;
  next();
});

export const validateFieldsAvailable = controller(async (req: any, _, next) => {
  const fields = await fieldService.findMany(
    { _id: { $in: req.fieldIds } },
    { _id: true }
  );

  if (fields.length !== req.fieldIds?.length)
    throw Error("One or more than one of the fields not available");

  next();
});

export const validateActionAvailable = controller(async (req, _, next) => {
  const { action } = req.body;
  const type = await typeService.findByType(action);
  if (!type) throw Error("Invalid action");
  next();
});
