import { PrismaService } from '../prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { FilterOptions, FlagOptions, OrderBy, PaginationOptions, SortOptions } from './interfaces/reagentOptions.interface';
import { Prisma } from '@prisma/client';
import { CountResult, IReagentRepository, ReagentList } from './interfaces/reagentRepository.interface';
import { UpdateReagentDto } from './dto/updateReagent.dto';
import { IReagent } from './interfaces/reagentEntity.interface';
import { CreateSampleDto } from './dto/createSample.dto';

@Injectable()
export class ReagentRepository implements IReagentRepository {
  private logger = new Logger(ReagentRepository.name);

  constructor(private prisma: PrismaService) {}

  async createMany(reagents: IReagent[]): Promise<IReagent[]> {
    return await this.prisma.reagent.createManyAndReturn({
      data: reagents,
    });
  }

  async findManyById(ids: number[]): Promise<IReagent[]> {
    return await this.prisma.reagent.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async create(reagent: IReagent): Promise<IReagent> {
    return await this.prisma.reagent.create({
      data: reagent,
    });
  }

  async createSample(sample: CreateSampleDto): Promise<IReagent> {
    const { usedReagentSample, ...sampleRest } = sample;
    return await this.prisma.reagent.create({
      data: {
        ...sampleRest,
        category: 'Sample',
        usedReagentSample: {
          connect: usedReagentSample?.map((reagent) => ({ id: reagent.reagentId })),
        },
      },
      include: {
        usedReagentSample: true,
      },
    });
  }

  async update(reagent: IReagent): Promise<IReagent> {
    return await this.prisma.reagent.update({
      where: { id: reagent.id },
      data: reagent,
      include: {
        usedReagentSample: true,
      },
    });
  }

  async updateById(data: UpdateReagentDto, id: number, isDeleted: boolean): Promise<IReagent> {
    return await this.prisma.reagent.update({
      where: { id },
      data: {
        ...data,
        isDeleted,
      },
      include: {
        usedReagentSample: true,
      },
    });
  }

  async upsert(reagent: IReagent): Promise<void> {
    await this.prisma.reagent.upsert({
      where: { id: reagent.id },
      update: { ...reagent },
      create: { ...reagent },
    });
  }

  async findById(id: number): Promise<IReagent | null> {
    return await this.prisma.reagent.findUnique({
      where: { id },
      include: {
        usedReagentSample: true,
      },
    });
  }

  async findAll(
    filter?: FilterOptions,
    pagination?: PaginationOptions,
    sorting?: SortOptions,
    flag?: FlagOptions,
  ): Promise<ReagentList> {
    const { skip = 0, take = 10 } = pagination || {};
    const orderBy = this.orderFactory(sorting);
    const { isFullStructure } = flag || {};

    const countQuery = `SELECT COUNT(*) AS size `;
    const searchQuery = `SELECT re."id", re."name", re."category", re."structure", re."description", re."quantityLeft", re."totalQuantity", re."quantityUnit", re."casNumber", 
                   json_build_object(
                      'name', s."name",
                      'room', json_build_object('name', r."name")
                   ) AS storage, re."storageId"
                    `;

    let inputString = `FROM "Reagent" re
                   JOIN "Storage" s ON s.id = re."storageId"
                   JOIN "Room" r ON s."roomId" = r.id
                   WHERE re."isDeleted" = FALSE `;

    const params: any[] = [];
    if (filter?.name) {
      inputString += `AND re."name" ILIKE '%' || $${params.length + 1} || '%' `;
      params.push(filter.name);
    }

    if (filter?.category) {
      inputString += `AND re."category" = $${params.length + 1}::"Category" `;
      params.push(filter.category);
    }

    if (filter?.storageId) {
      inputString += `AND re."storageId" = $${params.length + 1} `;
      params.push(filter.storageId);
    }

    if (filter?.structure) {
      if (isFullStructure === undefined) {
        inputString += `AND re."structure" @>$${params.length + 1} `;
      } else if (isFullStructure === true) {
        inputString += `AND re."structure" =$${params.length + 1} `;
      } else if (isFullStructure === false) {
        inputString += `AND re."structure" @>$${params.length + 1} AND re."structure" !=$${params.length + 1} `;
      }
      params.push(filter.structure);
    }

    const count = await this.prisma.$queryRawUnsafe<CountResult[]>(countQuery + inputString, ...params);
    const size = Number(count[0]?.size) ?? 0;

    inputString += ` GROUP BY re."id", re."name", re."category", re."structure", re."description", re."quantityLeft", re."totalQuantity", re."quantityUnit", re."casNumber", re."storageId", s."name", r."name" `;

    if (orderBy) {
      if (Array.isArray(orderBy)) {
        const orderClause = orderBy.map((order) => {
          const [key, value] = Object.entries(order)[0];
          return `re."${key}" ${value}`;
        });
        inputString += ` ORDER BY ${orderClause.join(' ,')}`;
        console.log(` ORDER BY ${orderClause.join(' ,')}`);
      } else {
        const orderClause = Object.entries(orderBy).map(([key, value]) => {
          return `re."${key}" ${value}`;
        });
        inputString += ` ORDER BY ${orderClause[0]} `;
      }
    }

    inputString += ` LIMIT ${take} OFFSET ${skip}`;
    console.log(inputString);
    console.log(searchQuery + inputString);
    console.log(countQuery + inputString);
    const reagents: IReagent[] = await this.prisma.$queryRawUnsafe(searchQuery + inputString, ...params);
    return {
      reagents,
      size,
      pageSize: reagents.length,
    };
  }

  async delete(id: number): Promise<IReagent> {
    return await this.prisma.reagent.delete({
      where: { id },
    });
  }

  private orderFactory(
    sortOptions: SortOptions | undefined,
  ): Prisma.ReagentOrderByWithRelationInput | Prisma.ReagentOrderByWithRelationInput[] | undefined {
    this.logger.log(`[${this.orderFactory.name}] - Started`);
    try {
      if (!sortOptions) return undefined;

      const orderBy: OrderBy = {};
      if (sortOptions.sortByName) {
        orderBy.name = sortOptions.sortByName;
      }
      if (sortOptions.sortByCreationDate) {
        orderBy.createdAt = sortOptions.sortByCreationDate;
      }
      if (sortOptions.sortByUpdatedDate) {
        orderBy.updatedAt = sortOptions.sortByUpdatedDate;
      }
      this.logger.log(`[${this.orderFactory.name}] - Finished`);
      if (Object.keys(orderBy).length === 1) {
        return orderBy;
      } else if (Object.keys(orderBy).length > 1) {
        const res = Object.entries(orderBy).map(([key, value]) => {
          return { [key]: value };
        });
        return res;
      } else {
        return undefined;
      }
    } catch (error) {
      this.logger.error(`[${this.orderFactory.name}] - Error: ${error}`);
      throw error;
    }
  }
}

const REAGENT_REPOSITORY_TOKEN = Symbol('REAGENT_REPOSITORY_TOKEN');
const ReagentRepositoryProvider = {
  provide: REAGENT_REPOSITORY_TOKEN,
  useClass: ReagentRepository,
};

export { REAGENT_REPOSITORY_TOKEN, ReagentRepositoryProvider };
