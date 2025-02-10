import mongoose from "mongoose";

const fieldTypes = ["text", "email", "num"] as const;
type TFieldType = (typeof fieldTypes)[number];
export type TField = {
  title: string;
  type: TFieldType;
};

export type TFieldDocument = TField & Document;

const fieldSchema = new mongoose.Schema(
  {
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
  },
  {
    strict: true,
  }
);

const Field = mongoose.model<TFieldDocument>("Field", fieldSchema);

export { Field };
