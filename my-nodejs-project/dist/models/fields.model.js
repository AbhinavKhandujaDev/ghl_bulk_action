"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const fieldTypes = ["text", "email", "num"];
const fieldSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: fieldTypes,
        required: true,
        default: fieldTypes[0],
    },
}, {
    strict: true,
});
const Field = mongoose_1.default.model("Field", fieldSchema);
exports.Field = Field;
//# sourceMappingURL=fields.model.js.map