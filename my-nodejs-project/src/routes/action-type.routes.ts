import controller, { sendResponse } from "@/controllers";
import { TActionType } from "@/models/action-types.model";
import { typeService as service } from "@/services";
import { Router } from "express";

const router = Router();

router.get(
  "",
  controller(async (req, res) => {
    const data = await service.findMany();
    return sendResponse(res, true, { data });
  })
);

router.get(
  ":id",
  controller(async (req, res) => {
    const { id } = req.params;
    const data = await service.findById(id);
    return sendResponse(res, true, { data });
  })
);

router.post(
  "",
  controller(async (req, res) => {
    const types = req.body as TActionType[];
    const data = await service.create(types);
    return sendResponse(res, true, { data });
  })
);

export default router;
