"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACTION_QUEUED = exports.ACTION_RUNNING = exports.ACTION_KEY = exports.PORT = exports.KAFKA_CONSUMER_GROUP = exports.ACTION_TOPIC = exports.KAFKA_RECORDS_TOPIC = exports.KAFKA_BROKER = exports.REDIS_URL = exports.MONGODB_URL = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.MONGODB_URL = process.env.MONGODB_URL || "mongodb://root:example@localhost:27017";
exports.REDIS_URL = process.env.REDIS_URL || "0.0.0.0:6379";
exports.KAFKA_BROKER = process.env.KAFKA_BROKER || "http://localhost:9092";
exports.KAFKA_RECORDS_TOPIC = "records";
exports.ACTION_TOPIC = "actions";
// export const TOPICS = {
//   ACTION_EXECUTION: "EXECUTION",
//   ACTION_QUEUED: "QUEUED",
// };
exports.KAFKA_CONSUMER_GROUP = process.env.KAFKA_CONSUMER_GROUP || "action";
exports.PORT = process.env.PORT || 8080;
exports.ACTION_KEY = "action";
exports.ACTION_RUNNING = `${exports.ACTION_KEY}:running`;
exports.ACTION_QUEUED = `${exports.ACTION_KEY}:queued`;
//# sourceMappingURL=config.js.map