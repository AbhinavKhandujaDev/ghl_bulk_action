import controller, { sendResponse } from "@/controllers";
import { Record, TRecord, TRecordDocument } from "@/models/records.model";
import { recordService as service } from "@/services";
import { Router } from "express";

const router = Router();

router.get(
  "",
  controller(async (req, res) => {
    const data = await service.findMany();
    return sendResponse(res, true, { data });
  })
);

router.post(
  "",
  controller(async (req, res) => {
    await service.create(req.body);
    return sendResponse(res, true);
  })
);

export default router;
