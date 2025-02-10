import mongoose, { Schema } from "mongoose";

export type TLog = {
  actionId: string;
  recordId: string;
  success: boolean;
  batchNum: number;
};

export type TLogDocument = TLog & Document;

const logsSchema = new mongoose.Schema({
  actionId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  recordId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  success: {
    type: Schema.Types.Boolean,
    required: true,
  },
  batchNum: {
    type: Schema.Types.Number,
    required: true,
  },
});

const Log = mongoose.model<TLogDocument>("Log", logsSchema);

export { Log };
