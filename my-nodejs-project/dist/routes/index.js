"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRoutes = setRoutes;
const record_routes_1 = __importDefault(require("./record.routes"));
const field_routes_1 = __importDefault(require("./field.routes"));
const action_routes_1 = __importDefault(require("./action.routes"));
const action_type_routes_1 = __importDefault(require("./action-type.routes"));
function setRoutes(app) {
    app.use("/records", record_routes_1.default);
    app.use("/fields", field_routes_1.default);
    app.use("/action-types", action_type_routes_1.default);
    app.use("/bulk-actions", action_routes_1.default);
}
//# sourceMappingURL=index.js.map