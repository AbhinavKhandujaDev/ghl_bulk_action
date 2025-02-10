"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = exports.objectToString = exports.stringToObject = void 0;
const config_1 = require("../config");
const ioredis_1 = __importDefault(require("ioredis"));
const REDIS_KEY_EXPIRY = 1 * 60 * 60; // 1hr
const stringToObject = (string) => {
    try {
        return JSON.parse(string || "");
    }
    catch (error) {
        return "";
    }
};
exports.stringToObject = stringToObject;
const objectToString = (obj) => {
    try {
        return JSON.stringify(obj || {});
    }
    catch (error) {
        return "";
    }
};
exports.objectToString = objectToString;
class RedisService extends ioredis_1.default {
    constructor(url) {
        super(url);
        this.redis = new ioredis_1.default(url);
    }
    async setValue(key, value) {
        if (typeof value === "object") {
            value = (0, exports.objectToString)(value);
        }
        if (typeof value !== "string" && typeof value !== "number")
            throw Error("redis value type is not in string or number");
        await this.set(key, value);
        this.expire(key, REDIS_KEY_EXPIRY);
    }
    async getValue(key) {
        const obj = (0, exports.stringToObject)(await this.get(key));
        return obj;
    }
}
exports.RedisService = RedisService;
exports.default = new RedisService(config_1.REDIS_URL);
//# sourceMappingURL=redisService.js.map