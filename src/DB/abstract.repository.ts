import {
  FilterQuery,
  Model,
  DeleteManyModel,
  ProjectionType,
  ObjectId,
  QueryOptions,
  RootFilterQuery,
  MongooseUpdateQueryOptions,
  UpdateQuery,
} from "mongoose";

/**
 * @description Abstract repository class for all repositories
 * @template T - The type of the model and its interface
 * @description This class is used to create a repository for all models
 */

export abstract class AbstractRepository<T> {
  // takes private model and assign it to the class
  constructor(private model: Model<T>) {
    this.model = model;
  }
  async isExists(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>
  ) {
    return await this.model.findOne(filter, projection, options);
  }
  async create(data: Partial<T> | T) {
    const doc = await this.model.create(data);
    return doc;
  }
  async findAll(filter: FilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>) {
    return this.model.find(filter, projection, options);
  }
  async findOne(filter: FilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>) {
    return this.model.findOne(filter, projection, options);
  }
  async updateOne(
    filter: RootFilterQuery<T>,
    data: UpdateQuery<T>,
    options?: MongooseUpdateQueryOptions<T>
  ) {
    return this.model.updateOne(filter, data, options);
  }

  async updateMany(
    filter: RootFilterQuery<T>,
    update: UpdateQuery<T>,
    options?: MongooseUpdateQueryOptions & MongooseUpdateQueryOptions<T>
  ) {
    return this.model.updateMany(filter, update, options);
  }

  async deleteById(id: ObjectId, options?: QueryOptions<T>) {
    return this.model.findByIdAndDelete(id, options);
  }
  async deleteMany(filter: FilterQuery<T>, options?: DeleteManyModel<T>) {
    return this.model.deleteMany(filter, options);
  }
  async deleteOne(filter: FilterQuery<T>) {
    return this.model.deleteOne(filter);
  }
}
