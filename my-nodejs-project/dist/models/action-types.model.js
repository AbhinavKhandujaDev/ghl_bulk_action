"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionType = exports.actionTypes = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.actionTypes = ["add", "upd", "del"];
const actionTypeSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: exports.actionTypes,
        required: true,
        unique: true,
    },
});
const ActionType = mongoose_1.default.model("ActionType", actionTypeSchema);
exports.ActionType = ActionType;
//# sourceMappingURL=action-types.model.js.map