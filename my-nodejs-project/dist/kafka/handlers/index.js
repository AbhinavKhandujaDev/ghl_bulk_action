"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionHandler = void 0;
const updateHandler_1 = require("./updateHandler");
const services_1 = require("../../services");
const action_model_1 = require("../../models/action.model");
const actionHandler = async (payload, produce) => {
    const { value } = payload.message;
    const actionId = value?.toString();
    if (!actionId)
        return;
    const action = await services_1.actionService.findByIdAndUpdate(actionId, {
        status: action_model_1.STATUS.RUNNING,
    });
    if (!action)
        return;
    const { actionType } = action || {};
    const data = await services_1.actionService.setRunningAction(actionId);
    produce(actionType, data);
};
exports.actionHandler = actionHandler;
const handlers = {
    upd: updateHandler_1.updateHandler,
};
exports.default = handlers;
//# sourceMappingURL=index.js.map