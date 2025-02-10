import { EachMessagePayload } from "kafkajs";
import { updateHandler } from "./updateHandler";
import { actionService } from "@/services";
import { STATUS } from "@/models/action.model";

export const actionHandler = async (
  payload: EachMessagePayload,
  produce: any
) => {
  const { value } = payload.message;
  const actionId = value?.toString();
  if (!actionId) return;
  const action = await actionService.findByIdAndUpdate(actionId, {
    status: STATUS.RUNNING,
  });
  if (!action) return;

  const { actionType } = action || {};
  await actionService.setRunningAction(actionId);
  produce(actionType, "");
};

const handlers: Record<string, any> = {
  upd: updateHandler,
};

export default handlers;
