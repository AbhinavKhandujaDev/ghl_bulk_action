"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("./routes/index");
const config_1 = require("./config");
const kafka_1 = require("./kafka");
const setupMongoDB = async () => {
    const options = {
        virtuals: true,
        transform: function (_, ret) {
            if (ret._id) {
                ret.id = String(ret._id);
            }
            delete ret._id;
            delete ret.__v;
        },
    };
    mongoose_1.default.set("toJSON", options);
    mongoose_1.default.set("toObject", options);
    await mongoose_1.default
        .connect(config_1.MONGODB_URL)
        .catch((err) => console.error("MongoDB connection error:", err));
};
function main() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    (0, index_1.setRoutes)(app);
    app.listen(config_1.PORT, () => console.log(`Server started on ${config_1.PORT}`));
}
setupMongoDB()
    .then(kafka_1.setupKafka)
    .then(main)
    .catch((e) => console.log("error while stating server", e));
//# sourceMappingURL=app.js.map