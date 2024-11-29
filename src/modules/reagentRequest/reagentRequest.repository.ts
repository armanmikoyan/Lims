import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IReagentRequest } from './interfaces/reagentRequestEntity.interface';
import { IReagentRequestRepository, IWhereClause, RequestList } from './interfaces/reagentRequestRepository.interface';
import { Prisma } from '@prisma/client';
import { FilterOptions, OrderBy, PaginationOptions, SortOptions } from './interfaces/reagentRequestOptions.interface';
import { UpdateReagentRequestDto } from './dto/updateReagentRequest.dto';

@Injectable()
class ReagentRequestRepository implements IReagentRequestRepository {
  private logger = new Logger(ReagentRequestRepository.name);

  constructor(private prisma: PrismaService) {}

  async create(request: IReagentRequest): Promise<IReagentRequest> {
    this.logger.log('Create method start');
    return await this.prisma.reagentRequest.create({
      data: request,
    });
  }

  async update(request: IReagentRequest): Promise<IReagentRequest> {
    this.logger.log('Update method start');
    return await this.prisma.reagentRequest.update({
      where: { id: request.id },
      data: request,
    });
  }

  async updateById(data: UpdateReagentRequestDto, id: number): Promise<IReagentRequest> {
    this.logger.log('UpdateById method start');
    return await this.prisma.reagentRequest.update({
      where: { id },
      data,
    });
  }

  async upsert(request: IReagentRequest): Promise<void> {
    this.logger.log('Upsert method start');
    await this.prisma.reagentRequest.upsert({
      where: { id: request.id },
      update: { ...request },
      create: { ...request },
    });
  }

  async delete(id: number): Promise<IReagentRequest> {
    this.logger.log('Delete method start');
    return await this.prisma.reagentRequest.delete({
      where: { id },
    });
  }

  async findById(id: number, userId?: number): Promise<IReagentRequest | null> {
    this.logger.log('findById method start');
    if (userId) {
      return await this.prisma.reagentRequest.findUnique({
        where: { id, userId },
      });
    }
    return await this.prisma.reagentRequest.findUnique({
      where: { id },
    });
  }

  async findAll(filter?: FilterOptions, pagination?: PaginationOptions, sort?: SortOptions, id?: number): Promise<RequestList> {
    this.logger.log('findAll method start');
    const { skip = 0, take = 10 } = pagination || {};
    const orderBy = this.orderFactory(sort);
    const whereClause: IWhereClause = {};

    if (filter?.name) {
      whereClause.name = {
        contains: filter.name,
        mode: 'insensitive',
      };
    }
    if (filter?.status) {
      whereClause.status = filter.status;
    }
    if (id) {
      this.logger.log(`[${this.findAll.name}] - Finished with checking User ID`);
      whereClause.userId = id;
    }
    this.logger.log(`[${this.findAll.name}] - Finished`);
    const [requests, size] = await this.prisma.$transaction([
      this.prisma.reagentRequest.findMany({
        where: { ...whereClause, hide: false },
        skip,
        take,
        orderBy,
      }),
      this.prisma.reagentRequest.count({
        where: { ...whereClause, hide: false },
      }),
    ]);
    return {
      requests,
      size,
    };
  }

  private orderFactory(
    sortOptions: SortOptions | undefined,
  ): Prisma.ReagentOrderByWithRelationInput | Prisma.ReagentOrderByWithRelationInput[] | undefined {
    try {
      this.logger.log(`[${this.orderFactory.name}] - Started`);
      if (!sortOptions) return undefined;
      const orderBy: OrderBy = {};
      if (sortOptions.sortByCreatedDate) {
        orderBy.createdAt = sortOptions.sortByCreatedDate;
      }
      if (sortOptions.sortByUpdatedDate) {
        orderBy.updatedAt = sortOptions.sortByUpdatedDate;
      }
      if (sortOptions.sortByQuantity) {
        orderBy.desiredQuantity = sortOptions.sortByQuantity;
      }

      this.logger.log(`[${this.orderFactory.name}] - Finished`);
      if (Object.keys(orderBy).length === 1) {
        return orderBy;
      } else if (Object.keys(orderBy).length > 1) {
        const orderArr = Object.entries(orderBy).map(([key, value]) => {
          return { [key]: value };
        });
        return orderArr;
      } else {
        return undefined;
      }
    } catch (error) {
      this.logger.error('Error in orderFactory: ', error);
      throw error;
    }
  }
}

const REQUEST_REPOSITORY_TOKEN = Symbol('REQUEST_REPOSITORY_TOKEN');
const RequestRepositoryProvider = {
  provide: REQUEST_REPOSITORY_TOKEN,
  useClass: ReagentRequestRepository,
};

export { REQUEST_REPOSITORY_TOKEN, RequestRepositoryProvider };
