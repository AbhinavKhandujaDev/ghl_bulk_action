import controller, { sendResponse } from "@/controllers";
import { produceAction } from "@/kafka";
import {
  validateActionAvailable,
  validateParamsAvailable,
  validateRateLimit,
} from "@/middleware/action.middleware";
import { STATUS } from "@/models/action.model";
import { actionService as service } from "@/services";
import { Router } from "express";

const router = Router();

router.get(
  "",
  controller(async (_, res) => {
    const data = await service.findMany();
    return sendResponse(res, true, { data });
  })
);

router.get(
  "/:id",
  controller(async (req, res) => {
    const { id } = req.params;
    const data = await service.findById(id);
    return sendResponse(res, true, { data });
  })
);

router.post(
  "",
  validateRateLimit,
  validateActionAvailable,
  validateParamsAvailable,
  controller(async (req, res) => {
    const { action: actionType, actData } = req.body;

    const status = STATUS.QUEUED;
    const data = await service.create({ actionType, actData, status });

    produceAction(data._id.toString());

    return sendResponse(res, true, {
      data,
      message: "Action queued",
    });
  })
);

export default router;
