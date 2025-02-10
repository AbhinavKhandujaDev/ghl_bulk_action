"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Record = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const recordSchema = new mongoose_1.default.Schema({}, { strict: false });
const Record = mongoose_1.default.model("Record", recordSchema);
exports.Record = Record;
//# sourceMappingURL=records.model.js.map