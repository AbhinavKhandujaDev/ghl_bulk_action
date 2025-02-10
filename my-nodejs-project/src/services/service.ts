import mongoose, {
  Document,
  FilterQuery,
  Model,
  RootFilterQuery,
} from "mongoose";
import redisService from "./redisService";

export default class Service<T = any, D = Document<any, any, any>> {
  constructor(protected model: Model<D>) {}
  async findById(data: string) {
    const doc = await this.model.findById(data);
    if (doc?.id) redisService.setValue(doc.id, doc?.toJSON());
    return doc;
  }
  async findByIdAndUpdate(id: string, value: any) {
    const cacheDoc = await redisService.getValue(id);

    if (cacheDoc) {
      this.model.findByIdAndUpdate(id, value).catch();
      return { ...cacheDoc, ...value };
    }

    const doc = await this.model.findByIdAndUpdate(id, value);
    if (doc?.id) redisService.setValue(doc.id, doc?.toJSON()).catch();
    return doc;
  }
  async remove(data: string) {
    this.model.findByIdAndDelete(data);
  }
  async findMany(
    query: FilterQuery<D> = {},
    projection?: mongoose.ProjectionType<D> | null,
    skip = 0,
    limit = 10
  ) {
    const doc = await this.model
      .find(query, projection)
      .skip(skip)
      .limit(limit);
    return doc;
  }
  async create(data: T | T[]) {
    const doc = await this.model.create(data);
    if (!Array.isArray(data)) {
      await redisService.setValue(doc.id, doc.toJSON());
    }
    return doc;
  }
  async updateMany(query: RootFilterQuery<D>, value: any) {
    return this.model.updateMany(query, value);
  }
  async removeMany(query: FilterQuery<D>) {
    await this.model.deleteMany(query);
  }
}
