import { ACTION_TOPIC } from "@/config";
import { STATUS } from "@/models/action.model";
import { TLog } from "@/models/logs.model";
import {
  actionService,
  fieldService,
  logService,
  recordService,
} from "@/services";
import redisService from "@/services/redisService";
import { Consumer, EachMessagePayload } from "kafkajs";
import { Types } from "mongoose";

const getEmailFieldId = async () => {
  const rkey = "email-field-id";
  let fId = await redisService.get(rkey);
  if (!fId) {
    const fields = await fieldService.findMany();
    const emailField = fields.find((field) => field.type === "email");
    await redisService.set(rkey, emailField?.id);
    fId = emailField?.id;
  }
  return fId;
};

const log = async (
  recordIds: Types.ObjectId[],
  actionId: string,
  batchNum: number,
  success: boolean
) => {
  const batchLogs: TLog[] = recordIds.map((_id) => {
    const recordId = _id.toString();
    return { actionId, recordId, success, batchNum };
  });
  await logService.create(batchLogs);
};

const wait = async (delay = 600) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

export const updateHandler = async (
  actionConsumer: Consumer,
  payload: EachMessagePayload
) => {
  await wait(1000);
  const { value } = payload.message;
  const data = JSON.parse(value?.toString() || "");

  const { actionId = "", skip = 0 } = data;

  if (!actionId) throw Error("Action id not found");
  const limit = 30;
  const records = await recordService.findMany({}, { _id: true }, skip, limit);

  if (!records.length) {
    await actionService.markRunningActionStatus(STATUS.COMPLETED);
    actionConsumer.resume([{ topic: ACTION_TOPIC }]);
    return;
  }

  const action = await actionService.findById(actionId);
  if (!action) return;
  const { actData, succeeded = 0, failed = 0 } = action;
  const updateObject = Object.fromEntries(actData as any);
  console.log({ skip });

  // const emailFieldId = await getEmailFieldId();
  // const skipped = [];
  // records = records.reduce((acc, curr) => {
  //   if (
  //     emailFieldId &&
  //     curr.id === emailFieldId &&
  //     updateObject[emailFieldId] === curr[emailFieldId]
  //   ) {
  //     skipped.push(emailFieldId);
  //   } else {
  //     acc.push(curr);
  //   }
  //   return acc;
  // }, [] as any[]);

  const recIds = records.map(({ _id }) => _id);
  await recordService
    .updateMany({ _id: { $in: recIds } }, { ...updateObject })
    .then(() => {
      log(recIds, actionId, skip, true);
      actionService.findByIdAndUpdate(actionId, {
        succeeded: succeeded + records.length,
        // skipped: skipped.length,
      });
    })
    .catch((e) => {
      console.log({ e });

      log(recIds, actionId, skip, false);
      actionService.findByIdAndUpdate(actionId, {
        failed: failed + limit,
        // skipped: skipped.length,
      });
    });

  await actionService.runNextBatch(limit).catch(async () => {
    log(recIds, actionId, skip, false);
    actionService.findByIdAndUpdate(actionId, { failed: failed + limit });
    actionService.markRunningActionStatus(STATUS.FAILED);
  });
};
