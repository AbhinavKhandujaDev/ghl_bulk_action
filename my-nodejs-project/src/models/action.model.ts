import mongoose, { Schema } from "mongoose";
import { actionTypes, TActionKey } from "./action-types.model";

export const STATUS = {
  QUEUED: "queued",
  FAILED: "failed",
  RUNNING: "running",
  COMPLETED: "completed",
} as const;

const actionStatus = [STATUS.QUEUED, STATUS.RUNNING, STATUS.COMPLETED] as const;
type TStatus = (typeof actionStatus)[number];

export type TAction = {
  id?: string;
  actionType: TActionKey;

  actData: [string, any];
  status: TStatus;

  completed?: boolean;

  succeeded?: number;
  failed?: number;
  skipped?: number;
};

export type TActionDocument = TAction & Document;

const actionSchema = new mongoose.Schema(
  {
    actionType: {
      type: String,
      enum: actionTypes,
      required: true,
    },
    actData: {
      type: [[String, mongoose.Schema.Types.Mixed]],
      required: true,
    },
    status: {
      type: String,
      enum: actionStatus,
      default: STATUS.QUEUED,
    },
    completed: {
      type: Schema.Types.Boolean,
      default: 0,
    },
    succeeded: {
      type: Schema.Types.Number,
      default: 0,
    },
    failed: {
      type: Schema.Types.Number,
      default: 0,
    },
    skipped: {
      type: Schema.Types.Number,
      default: 0,
    },
  },
  { strict: true, timestamps: true }
);

const Action = mongoose.model<TActionDocument>("Action", actionSchema);

export { Action };
