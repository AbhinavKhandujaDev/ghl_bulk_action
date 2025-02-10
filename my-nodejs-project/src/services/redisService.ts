import { REDIS_URL } from "@/config";
import Redis, { RedisKey } from "ioredis";

const REDIS_KEY_EXPIRY = 1 * 60 * 60; // 1hr

export const stringToObject = (string?: string | null) => {
  try {
    return JSON.parse(string || "");
  } catch (error) {
    return "";
  }
};

export const objectToString = (obj?: object | null) => {
  try {
    return JSON.stringify(obj || {});
  } catch (error) {
    return "";
  }
};

export class RedisService extends Redis {
  redis: Redis;

  constructor(url: string) {
    super(url);
    this.redis = new Redis(url);
  }

  public async setValue(
    key: RedisKey,
    value: string | Buffer | number | object
  ): Promise<void> {
    if (typeof value === "object") {
      value = objectToString(value as object);
    }

    if (typeof value !== "string" && typeof value !== "number")
      throw Error("redis value type is not in string or number");

    await this.set(key, value);
    this.expire(key, REDIS_KEY_EXPIRY);
  }

  public async getValue(key: string) {
    const obj = stringToObject(await this.get(key));
    return obj;
  }
}

export default new RedisService(REDIS_URL);
