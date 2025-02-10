import controller, { sendResponse } from "@/controllers";
import { fieldService as service } from "@/services";
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
    const data = await service.create(req.body);
    return sendResponse(res, true, { data });
  })
);

export default router;
