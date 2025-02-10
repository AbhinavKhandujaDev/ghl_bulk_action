import redisService from "./redisService";
import Service from "./service";
import {
  ActionType,
  TActionKey,
  TActionType,
  TActionTypeDocument,
} from "@/models/action-types.model";

class ActionTypeService extends Service<TActionType, TActionTypeDocument> {
  constructor() {
    super(ActionType);
  }

  async findByType(type: TActionKey) {
    const rkey = `action-type:${type}`;
    const cache = await redisService.getValue(rkey);
    if (cache) return cache;

    const action = await this.model.findOne({ type });
    if (!action) return;

    const obj = action?.toJSON();
    redisService.setValue(rkey, obj);
    return obj;
  }
}

export default ActionTypeService;
