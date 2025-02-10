import dotenv from "dotenv";
dotenv.config();

export const MONGODB_URL =
  process.env.MONGODB_URL || "mongodb://root:example@localhost:27017";
export const REDIS_URL = process.env.REDIS_URL || "0.0.0.0:6379";
export const KAFKA_BROKER = process.env.KAFKA_BROKER || "http://localhost:9092";
export const KAFKA_RECORDS_TOPIC = "records";
export const ACTION_TOPIC = "actions";

// export const TOPICS = {
//   ACTION_EXECUTION: "EXECUTION",
//   ACTION_QUEUED: "QUEUED",
// };

export const KAFKA_CONSUMER_GROUP =
  process.env.KAFKA_CONSUMER_GROUP || "action";
export const PORT = process.env.PORT || 8080;

export const ACTION_KEY = "action";
export const ACTION_RUNNING = `${ACTION_KEY}:running`;
export const ACTION_QUEUED = `${ACTION_KEY}:queued`;
