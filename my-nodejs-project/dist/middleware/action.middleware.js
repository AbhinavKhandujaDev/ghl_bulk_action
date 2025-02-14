"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateActionAvailable = exports.validateFieldsAvailable = exports.validateParamsAvailable = exports.validateRateLimit = void 0;
const controllers_1 = __importDefault(require("../controllers"));
const services_1 = require("../services");
const redisService_1 = __importDefault(require("../services/redisService"));
exports.validateRateLimit = (0, controllers_1.default)(async (_, __, next) => {
    const userId = "def-ip";
    const count = await redisService_1.default.incr(userId);
    if (count === 1)
        redisService_1.default.expire(userId, 60);
    if (count > 3)
        throw Error("Too many requests per minute");
    next();
});
exports.validateParamsAvailable = (0, controllers_1.default)(async (req, _, next) => {
    const { action, actData } = req.body;
    if (!action)
        throw Error("action not found");
    const fieldIds = Object.keys(actData);
    if (!fieldIds.length)
        throw Error("actData is missing");
    req.fieldIds = fieldIds;
    next();
});
exports.validateFieldsAvailable = (0, controllers_1.default)(async (req, _, next) => {
    const fields = await services_1.fieldService.findMany({ _id: { $in: req.fieldIds } }, { _id: true });
    if (fields.length !== req.fieldIds?.length)
        throw Error("One or more than one of the fields not available");
    next();
});
exports.validateActionAvailable = (0, controllers_1.default)(async (req, _, next) => {
    const { action } = req.body;
    const type = await services_1.typeService.findByType(action);
    if (!type)
        throw Error("Invalid action");
    next();
});
//# sourceMappingURL=action.middleware.js.map