"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = exports.STATUS = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const action_types_model_1 = require("./action-types.model");
exports.STATUS = {
    QUEUED: "queued",
    FAILED: "failed",
    RUNNING: "running",
    COMPLETED: "completed",
};
const actionStatus = [exports.STATUS.QUEUED, exports.STATUS.RUNNING, exports.STATUS.COMPLETED];
const actionSchema = new mongoose_1.default.Schema({
    actionType: {
        type: String,
        enum: action_types_model_1.actionTypes,
        required: true,
    },
    actData: {
        type: Map,
        of: mongoose_1.default.Schema.Types.Mixed,
        required: true,
    },
    status: {
        type: String,
        enum: actionStatus,
        default: exports.STATUS.QUEUED,
    },
    succeeded: {
        type: mongoose_1.Schema.Types.Number,
        default: 0,
    },
    failed: {
        type: mongoose_1.Schema.Types.Number,
        default: 0,
    },
    skipped: {
        type: mongoose_1.Schema.Types.Number,
        default: 0,
    },
}, { strict: true, timestamps: true });
const Action = mongoose_1.default.model("Action", actionSchema);
exports.Action = Action;
//# sourceMappingURL=action.model.js.map