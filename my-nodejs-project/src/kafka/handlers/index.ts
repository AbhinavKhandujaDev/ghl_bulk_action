import { EachMessagePayload } from "kafkajs";
import { updateHandler } from "./updateHandler";
import { actionService } from "@/services";
import { STATUS } from "@/models/action.model";
import { TActionKey } from "@/models/action-types.model";

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
  const data = await actionService.setRunningAction(actionId);
  produce(actionType, data);
};

const handlers: Partial<Record<TActionKey, any>> = {
  upd: updateHandler,
};

export default handlers;
