"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActionTypes = exports.createActionTypes = void 0;
const action_types_model_1 = require("../models/action-types.model");
const createActionTypes = async (data) => {
    const createdTypes = await action_types_model_1.ActionType.create(data);
    return createdTypes;
};
exports.createActionTypes = createActionTypes;
const getActionTypes = async (data) => {
    const actions = await action_types_model_1.ActionType.find({ _id: { $in: data } });
    return actions;
};
exports.getActionTypes = getActionTypes;
