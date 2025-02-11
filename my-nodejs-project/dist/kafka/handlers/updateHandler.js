"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHandler = void 0;
const config_1 = require("../../config");
const action_model_1 = require("../../models/action.model");
const services_1 = require("../../services");
const redisService_1 = __importDefault(require("../../services/redisService"));
const getEmailFieldId = async () => {
    const rkey = "email-field-id";
    let fId = await redisService_1.default.get(rkey);
    if (!fId) {
        const fields = await services_1.fieldService.findMany();
        const emailField = fields.find((field) => field.type === "email");
        await redisService_1.default.set(rkey, emailField?.id);
        fId = emailField?.id;
    }
    return fId;
};
const log = async (recordIds, actionId, batchNum, success) => {
    const batchLogs = recordIds.map((_id) => {
        const recordId = _id.toString();
        return { actionId, recordId, success, batchNum };
    });
    await services_1.logService.create(batchLogs);
};
const wait = async (delay = 600) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};
const updateHandler = async (actionConsumer, payload) => {
    await wait(1000);
    const { value } = payload.message;
    const data = JSON.parse(value?.toString() || "");
    const { actionId = "", skip = 0 } = data;
    if (!actionId)
        throw Error("Action id not found");
    const limit = 30;
    const records = await services_1.recordService.findMany({}, { _id: true }, skip, limit);
    if (!records.length) {
        await services_1.actionService.markRunningActionStatus(action_model_1.STATUS.COMPLETED);
        actionConsumer.resume([{ topic: config_1.ACTION_TOPIC }]);
        return;
    }
    const action = await services_1.actionService.findById(actionId);
    if (!action)
        return;
    const { actData, succeeded = 0, failed = 0 } = action;
    const updateObject = Object.fromEntries(actData);
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
    await services_1.recordService
        .updateMany({ _id: { $in: recIds } }, { ...updateObject })
        .then(() => {
        log(recIds, actionId, skip, true);
        services_1.actionService.findByIdAndUpdate(actionId, {
            succeeded: succeeded + records.length,
            // skipped: skipped.length,
        });
    })
        .catch((e) => {
        console.log({ e });
        log(recIds, actionId, skip, false);
        services_1.actionService.findByIdAndUpdate(actionId, {
            failed: failed + limit,
            // skipped: skipped.length,
        });
    });
    await services_1.actionService.runNextBatch(limit).catch(async () => {
        log(recIds, actionId, skip, false);
        services_1.actionService.findByIdAndUpdate(actionId, { failed: failed + limit });
        services_1.actionService.markRunningActionStatus(action_model_1.STATUS.FAILED);
    });
};
exports.updateHandler = updateHandler;
//# sourceMappingURL=updateHandler.js.map