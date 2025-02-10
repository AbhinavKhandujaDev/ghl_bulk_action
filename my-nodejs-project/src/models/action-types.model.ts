import mongoose from "mongoose";

export const actionTypes = ["add", "upd", "del"] as const;

export type TActionKey = (typeof actionTypes)[number];

export type TActionType = {
  title: string;
  type: TActionKey;
};

export type TActionTypeDocument = TActionType & Document;

const actionTypeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: actionTypes,
    required: true,
    unique: true,
  },
});

const ActionType = mongoose.model<TActionTypeDocument>(
  "ActionType",
  actionTypeSchema
);

export { ActionType };
