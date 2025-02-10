"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logService = exports.recordService = exports.fieldService = exports.actionService = exports.typeService = void 0;
const fields_model_1 = require("../models/fields.model");
const logs_model_1 = require("../models/logs.model");
const records_model_1 = require("../models/records.model");
const service_1 = __importDefault(require("./service"));
const action_service_1 = __importDefault(require("./action.service"));
const actionType_service_1 = __importDefault(require("./actionType.service"));
exports.typeService = new actionType_service_1.default();
exports.actionService = new action_service_1.default();
exports.fieldService = new service_1.default(fields_model_1.Field);
exports.recordService = new service_1.default(records_model_1.Record);
exports.logService = new service_1.default(logs_model_1.Log);
//# sourceMappingURL=index.js.map