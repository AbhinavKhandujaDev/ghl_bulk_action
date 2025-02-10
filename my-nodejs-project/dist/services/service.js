"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redisService_1 = __importDefault(require("./redisService"));
class Service {
    constructor(model) {
        this.model = model;
    }
    async findById(data) {
        const doc = await this.model.findById(data);
        if (doc?.id)
            redisService_1.default.setValue(doc.id, doc?.toJSON());
        return doc;
    }
    async findByIdAndUpdate(id, value) {
        const cacheDoc = await redisService_1.default.getValue(id);
        if (cacheDoc) {
            this.model.findByIdAndUpdate(id, value).catch();
            return { ...cacheDoc, ...value };
        }
        const doc = await this.model.findByIdAndUpdate(id, value);
        if (doc?.id)
            redisService_1.default.setValue(doc.id, doc?.toJSON()).catch();
        return doc;
    }
    async remove(data) {
        this.model.findByIdAndDelete(data);
    }
    async findMany(query = {}, projection, skip = 0, limit = 10) {
        const doc = await this.model
            .find(query, projection)
            .skip(skip)
            .limit(limit);
        return doc;
    }
    async create(data) {
        const doc = await this.model.create(data);
        if (!Array.isArray(data)) {
            await redisService_1.default.setValue(doc.id, doc.toJSON());
        }
        return doc;
    }
    async updateMany(query, value) {
        return this.model.updateMany(query, value);
    }
    async removeMany(query) {
        await this.model.deleteMany(query);
    }
}
exports.default = Service;
//# sourceMappingURL=service.js.map