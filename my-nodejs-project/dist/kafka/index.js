"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.produceAction = exports.produce = void 0;
exports.setupKafka = setupKafka;
const config_1 = require("../config");
const kafkajs_1 = require("kafkajs");
const index_1 = __importStar(require("../kafka/handlers/index"));
const kafka = new kafkajs_1.Kafka({
    clientId: "my-app",
    brokers: [config_1.KAFKA_BROKER],
});
const producer = kafka.producer();
const produce = (key, value) => {
    return producer.send({
        topic: config_1.KAFKA_RECORDS_TOPIC,
        messages: [{ key, value: JSON.stringify(value) }],
    });
};
exports.produce = produce;
const recordsConsumer = kafka.consumer({ groupId: "records" });
const actionsConsumer = kafka.consumer({ groupId: "actions" });
const produceAction = (actionId) => {
    return producer.send({
        topic: config_1.ACTION_TOPIC,
        messages: [{ value: actionId }],
    });
};
exports.produceAction = produceAction;
async function setupKafka() {
    const admin = kafka.admin();
    await admin.connect();
    const topics = [
        { topic: config_1.KAFKA_RECORDS_TOPIC, numPartitions: 1 },
        { topic: config_1.ACTION_TOPIC, numPartitions: 1 },
    ];
    await admin.createTopics({ topics });
    await producer.connect();
    await recordsConsumer.connect();
    await actionsConsumer.connect();
    await recordsConsumer.subscribe({
        topic: config_1.KAFKA_RECORDS_TOPIC,
        fromBeginning: true,
    });
    await actionsConsumer.subscribe({ topic: config_1.ACTION_TOPIC, fromBeginning: true });
    await recordsConsumer.run({
        autoCommit: true,
        eachMessage: async (payload) => {
            const key = payload.message.key?.toString();
            if (!key)
                throw Error("key not available");
            const handleMessage = index_1.default[key];
            handleMessage(actionsConsumer);
        },
    });
    await actionsConsumer.run({
        autoCommit: true,
        eachMessage: async (payload) => {
            actionsConsumer.pause([topics[1]]);
            (0, index_1.actionHandler)(payload, exports.produce);
        },
    });
}
//# sourceMappingURL=index.js.map