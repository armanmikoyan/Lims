export interface IRepository<T, R = any> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<R>;
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  upsert(entity: T): Promise<void>;
  delete(id: number): Promise<T>;
}
