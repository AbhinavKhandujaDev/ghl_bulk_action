import express from "express";
import mongoose from "mongoose";
import { setRoutes } from "./routes/index";
import { MONGODB_URL, PORT } from "./config";
import { setupKafka } from "./kafka";

const setupMongoDB = async () => {
  const options = {
    virtuals: true,
    transform: function (_: any, ret: Record<string, any>) {
      if (ret._id) {
        ret.id = String(ret._id);
      }
      delete ret._id;
      delete ret.__v;
    },
  };

  mongoose.set("toJSON", options);
  mongoose.set("toObject", options);

  await mongoose
    .connect(MONGODB_URL)
    .catch((err) => console.error("MongoDB connection error:", err));
};

function main() {
  const app = express();
  app.use(express.json());

  setRoutes(app);

  app.listen(PORT, () => console.log(`Server started on ${PORT}`));
}

setupMongoDB()
  .then(setupKafka)
  .then(main)
  .catch((e) => console.log("error while stating server", e));
