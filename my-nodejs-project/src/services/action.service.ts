import {
  TAction,
  TActionDocument,
  Action,
  STATUS,
} from "@/models/action.model";
import redisService from "./redisService";
import { ACTION_RUNNING } from "@/config";
import { produce } from "@/kafka";
import Service from "./service";

class ActionService extends Service<TAction, TActionDocument> {
  constructor() {
    super(Action);
  }

  async runNextBatch(limit: number) {
    const runningAction = await redisService.getValue(ACTION_RUNNING);
    const { actionId, skip } = runningAction;

    const doc = await this.findById(actionId);

    if (doc?.actionType) {
      const next = skip + limit;
      const data = { ...runningAction, skip: next };
      await redisService.setValue(ACTION_RUNNING, data);
      await produce(doc.actionType, data);
    }
  }

  async markRunningActionStatus(status: (typeof STATUS)[keyof typeof STATUS]) {
    const runningAction = await redisService.getValue(ACTION_RUNNING);
    const { actionId } = runningAction;
    await this.findByIdAndUpdate(actionId, { status });
    await redisService.del(ACTION_RUNNING);
  }

  async setRunningAction(actionId: string) {
    const data = { actionId, skip: 0 };
    await redisService.setValue(ACTION_RUNNING, data);
    return data;
  }

  async getRunningAction() {
    const runningAction = await redisService.getValue(ACTION_RUNNING);
    return runningAction;
  }
}

export default ActionService;
