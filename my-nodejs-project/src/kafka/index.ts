import { KAFKA_BROKER, KAFKA_RECORDS_TOPIC, ACTION_TOPIC } from "@/config";
import { ITopicConfig, Kafka } from "kafkajs";
import handlers, { actionHandler } from "@/kafka/handlers/index";
import { TActionKey } from "@/models/action-types.model";
import { actionService } from "@/services";
import { STATUS } from "@/models/action.model";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: [KAFKA_BROKER],
});

const producer = kafka.producer();

export const produce = (key: string, value?: any) => {
  return producer.send({
    topic: KAFKA_RECORDS_TOPIC,
    messages: [{ key, value: JSON.stringify(value) }],
  });
};

const recordsConsumer = kafka.consumer({ groupId: "records" });
const actionsConsumer = kafka.consumer({ groupId: "actions" });

export const produceAction = (actionId: string) => {
  return producer.send({
    topic: ACTION_TOPIC,
    messages: [{ value: actionId }],
  });
};

export async function setupKafka() {
  const admin = kafka.admin();
  await admin.connect();

  const topics: ITopicConfig[] = [
    { topic: KAFKA_RECORDS_TOPIC, numPartitions: 1 },
    { topic: ACTION_TOPIC, numPartitions: 1 },
  ];

  await admin.createTopics({ topics });

  await producer.connect();
  await recordsConsumer.connect();
  await actionsConsumer.connect();

  await recordsConsumer.subscribe({
    topic: KAFKA_RECORDS_TOPIC,
    fromBeginning: true,
  });
  await actionsConsumer.subscribe({ topic: ACTION_TOPIC, fromBeginning: true });

  await recordsConsumer.run({
    autoCommit: true,
    eachMessage: async (payload) => {
      const key = payload.message.key?.toString() as TActionKey;
      if (!key) throw Error("key not available");
      const handleMessage = handlers[key];
      handleMessage(actionsConsumer, payload).catch(async () => {
        await actionService.markRunningActionStatus(STATUS.FAILED);
        actionsConsumer.resume([topics[1]]);
      });
    },
  });

  await actionsConsumer.run({
    autoCommit: true,
    eachMessage: async (payload) => {
      actionsConsumer.pause([topics[1]]);
      actionHandler(payload, produce);
    },
  });
}
