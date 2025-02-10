"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redisService_1 = __importDefault(require("./redisService"));
const service_1 = __importDefault(require("./service"));
const action_types_model_1 = require("../models/action-types.model");
class ActionTypeService extends service_1.default {
    constructor() {
        super(action_types_model_1.ActionType);
    }
    async findByType(type) {
        const rkey = `action-type:${type}`;
        const cache = await redisService_1.default.getValue(rkey);
        if (cache)
            return cache;
        const action = await this.model.findOne({ type });
        if (!action)
            return;
        const obj = action?.toJSON();
        redisService_1.default.setValue(rkey, obj);
        return obj;
    }
}
exports.default = ActionTypeService;
//# sourceMappingURL=actionType.service.js.map