import { Field, TField, TFieldDocument } from "@/models/fields.model";
import { Log, TLog, TLogDocument } from "@/models/logs.model";
import { Record, TRecord, TRecordDocument } from "@/models/records.model";
import Service from "./service";
import ActionService from "./action.service";
import ActionTypeService from "./actionType.service";

export const typeService = new ActionTypeService();
export const actionService = new ActionService();
export const fieldService = new Service<TField, TFieldDocument>(Field);
export const recordService = new Service<TRecord, TRecordDocument>(Record);
export const logService = new Service<TLog, TLogDocument>(Log);
