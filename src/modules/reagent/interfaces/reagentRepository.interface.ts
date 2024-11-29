import { IRepository } from 'src/common/interfaces/repository.interface';
import { FilterOptions, FlagOptions, PaginationOptions, SortOptions } from './reagentOptions.interface';
import { UpdateReagentDto } from '../dto/updateReagent.dto';
import { IReagent } from './reagentEntity.interface';
import { CreateSampleDto } from '../dto/createSample.dto';

export interface IReagentRepository extends IRepository<IReagent> {
  findManyById(ids: number[]): Promise<IReagent[]>;
  findAll(
    filter?: FilterOptions,
    pagination?: PaginationOptions,
    sorting?: SortOptions,
    flag?: FlagOptions,
  ): Promise<ReagentList>;
  updateById(data: UpdateReagentDto, id: number, isDeleted: boolean): Promise<IReagent>;
  createSample(sample: CreateSampleDto): Promise<IReagent>;
  createMany(reagents: IReagent[]): Promise<IReagent[]>;
}

export type ReagentList = {
  reagents: IReagent[];
  size: number;
  pageSize: number;
};

export type CountResult = { size: number };
