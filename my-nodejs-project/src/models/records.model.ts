import mongoose from "mongoose";

export type TRecord = Record<string, any>;
export type TRecordDocument = TRecord & Document;

const recordSchema = new mongoose.Schema({}, { strict: false });

const Record = mongoose.model<TRecordDocument>("Record", recordSchema);

export { Record };
