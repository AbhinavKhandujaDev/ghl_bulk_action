"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const action_model_1 = require("../models/action.model");
const redisService_1 = __importDefault(require("./redisService"));
const config_1 = require("../config");
const kafka_1 = require("../kafka");
const service_1 = __importDefault(require("./service"));
class ActionService extends service_1.default {
    constructor() {
        super(action_model_1.Action);
    }
    async runNextBatch(limit) {
        const runningAction = await redisService_1.default.getValue(config_1.ACTION_RUNNING);
        const { actionId, skip } = runningAction;
        const doc = await this.findById(actionId);
        if (doc?.actionType) {
            const next = skip + limit;
            const data = { ...runningAction, skip: next };
            await redisService_1.default.setValue(config_1.ACTION_RUNNING, data);
            await (0, kafka_1.produce)(doc.actionType, data);
        }
    }
    async markRunningActionStatus(status) {
        const runningAction = await redisService_1.default.getValue(config_1.ACTION_RUNNING);
        const { actionId } = runningAction;
        await this.findByIdAndUpdate(actionId, { status });
        await redisService_1.default.del(config_1.ACTION_RUNNING);
    }
    async setRunningAction(actionId) {
        const data = { actionId, skip: 0 };
        await redisService_1.default.setValue(config_1.ACTION_RUNNING, data);
        return data;
    }
    async getRunningAction() {
        const runningAction = await redisService_1.default.getValue(config_1.ACTION_RUNNING);
        return runningAction;
    }
}
exports.default = ActionService;
//# sourceMappingURL=action.service.js.map