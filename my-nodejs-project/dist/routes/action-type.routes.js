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
const controllers_1 = __importStar(require("../controllers"));
const services_1 = require("../services");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("", (0, controllers_1.default)(async (req, res) => {
    const data = await services_1.typeService.findMany();
    return (0, controllers_1.sendResponse)(res, true, { data });
}));
router.get(":id", (0, controllers_1.default)(async (req, res) => {
    const { id } = req.params;
    const data = await services_1.typeService.findById(id);
    return (0, controllers_1.sendResponse)(res, true, { data });
}));
router.post("", (0, controllers_1.default)(async (req, res) => {
    const types = req.body;
    const data = await services_1.typeService.create(types);
    return (0, controllers_1.sendResponse)(res, true, { data });
}));
exports.default = router;
//# sourceMappingURL=action-type.routes.js.map