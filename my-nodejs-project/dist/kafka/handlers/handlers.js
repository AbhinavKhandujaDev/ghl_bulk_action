"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueActionHandler = exports.updateHandler = void 0;
const services_1 = require("../../services");
const log = async (recordIds, actionId, batchNum, success) => {
    const batchLogs = recordIds.map((_id) => {
        const recordId = _id.toString();
        return { actionId, recordId, success, batchNum };
    });
    await services_1.logService.create(batchLogs);
};
const updateHandler = async (payload, produce) => {
    const { value } = payload.message;
    const data = JSON.parse(value?.toString() || "{}");
    const { actionId, skip, actData } = data;
    const limit = 3;
    const { updateObject, fieldIds } = actData.reduce((acc, curr) => {
        const [fieldId, value] = curr;
        acc.updateObject[fieldId] = value;
        acc.fieldId.push(fieldId);
        return acc;
    }, { updateObject: {}, fieldIds: [] });
    const records = await services_1.recordService.findMany({}, fieldIds, skip, limit);
    if (!records.length) {
        await services_1.actionService.findByIdAndUpdate(actionId, { completed: true });
        produce("queue-action");
        return;
    }
    const recIds = records.map(({ _id }) => _id);
    await services_1.recordService
        .updateMany({ _id: { $in: recIds } }, updateObject)
        .then((doc) => {
        console.log({ d: doc.modifiedCount });
        // actionService.findByIdAndUpdate(actionId, {
        //   completed: recIds.length - doc.modifiedCount,
        //   failed:,
        //   skipped:,
        //   completedOn:,
        // })
        log(recIds, actionId, skip, true);
    })
        .catch(() => log(recIds, actionId, skip, false));
    // const actionKey = key?.toString() as TActionKey;
    // if (!actionKey) return;
    // produce(actionKey, value);
};
exports.updateHandler = updateHandler;
const queueActionHandler = async (produce) => {
    console.log("aaa");
    // const currentlyRunningAction = await Action.findOne({
    //   status: STATUS.RUNNING,
    // });
    // if (currentlyRunningAction) return;
    // const nextAction = await Action.findOne({
    //   status: STATUS.QUEUED,
    // }).sort({ createdAt: 1 });
    // if (!nextAction) return;
    // const { _id: actionId, actData, actionType } = nextAction;
    // produce(actionType, { actionId, skip: 0, actData });
};
exports.queueActionHandler = queueActionHandler;
