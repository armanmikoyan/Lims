import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IOrderRepository } from './interfaces/orderRepository.interface';
import {
  CompleteOrderData,
  OnlyReagentId,
  OrderList,
  OrderWithReagents,
  OrderWithReagentCount,
  OrderWithReagentCountObject,
  UpdateOrderData,
  OrderIdMappedWithReagentIds,
} from './types/order.type';
import { Order, Prisma, ReagentRequest, Status } from '@prisma/client';

import { PartialWithRequiredId } from 'src/common/types/idRequired.type';
import { OrderBy, OrderFilterOptions, OrderPaginationOptions, OrderSortOptions } from './types/orderOptions.type';

@Injectable()
export class OrderRepository implements IOrderRepository {
  private readonly logger: Logger = new Logger(OrderRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Order | null>;
  async findById(id: number, includeReagents: true): Promise<OrderWithReagents | null>;
  async findById(id: number, includeReagents: boolean = false): Promise<Order | OrderWithReagents | null> {
    this.logger.log(`[${this.findById.name}] - Method start`);
    try {
      const order: Order | OrderWithReagents | null = await this.prisma.order.findUnique({
        where: { id },
        include: {
          reagents: includeReagents,
        },
      });
      this.logger.log(`[${this.findById.name}] - Method finished`);
      return order;
    } catch (error) {
      this.logger.error(`[${this.findById.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async findAll(
    filterBy?: OrderFilterOptions,
    pagination?: OrderPaginationOptions,
    sortOptions?: OrderSortOptions,
  ): Promise<OrderList> {
    this.logger.log(`[${this.findAll.name}] - Method start`);
    try {
      const { skip = 0, take = 10 } = pagination || {};
      const orderBy: OrderBy = this.orderFactory(sortOptions);
      const where: Prisma.OrderWhereInput = {
        title: {
          contains: filterBy?.title,
          mode: 'insensitive',
        },
        seller: {
          contains: filterBy?.seller,
          mode: 'insensitive',
        },
        status: {
          equals: filterBy?.status,
        },
      };

      const [orders, size]: [OrderWithReagentCountObject[], number] = await this.prisma.$transaction([
        this.prisma.order.findMany({
          where,
          skip,
          take,
          orderBy: orderBy,
          include: {
            reagents: true,
            _count: {
              select: {
                reagents: true,
              },
            },
          },
        }),

        this.prisma.order.count({ where }),
      ]);

      const orderWithReagentCount: OrderWithReagentCount[] = orders.map(({ _count, ...orders }) => ({
        ...orders,
        reagentCount: _count.reagents,
      }));

      this.logger.log(`[${this.findAll.name}] - Method finished`);
      return { orders: orderWithReagentCount, size };
    } catch (error) {
      this.logger.error(`[${this.findAll.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async create(data: CompleteOrderData): Promise<OrderWithReagents> {
    this.logger.log(`[${this.create.name}] - Method start`);
    try {
      const requestedReagentIds: number[] = data.reagents.map((reagent) => reagent.id);
      const existingReagents: OnlyReagentId[] = await this.prisma.reagentRequest.findMany({
        where: {
          id: { in: requestedReagentIds },
        },
        select: { id: true },
      });

      const existingReagentIds: number[] = existingReagents.map((reagent) => reagent.id);

      const orderWithExistingOrderedRequest = await this.prisma.order.findMany({
        where: {
          reagents: {
            some: {
              id: {
                in: existingReagentIds,
              },
              status: Status.Ordered,
            },
          },
        },
        include: {
          reagents: {
            select: {
              id: true,
            },
          },
        },
      });

      const orderIdMappedWithOrderedReagentRequestIds: OrderIdMappedWithReagentIds[] = orderWithExistingOrderedRequest.map(
        (order) => ({
          orderId: order.id,
          matchedReagentRequestIds: order.reagents.map((reagent) => reagent.id).filter((id) => existingReagentIds.includes(id)),
        }),
      );

      if (orderIdMappedWithOrderedReagentRequestIds.length > 0) {
        const conflicts: string[] = [];
        orderIdMappedWithOrderedReagentRequestIds.map((order) => {
          conflicts.push(
            `Order with id ${order.orderId} includes reagentRequests with id[s] - ${order.matchedReagentRequestIds.join(', ')} which has status Ordered`,
          );
        });
        throw new ConflictException(conflicts);
      }

      const missingIds: number[] = requestedReagentIds.filter((id) => !existingReagentIds.includes(id));
      if (missingIds.length > 0) {
        this.logger.error(`[${this.create.name}] - Exception thrown: invalid regent ids`);
        throw new NotFoundException(`The following reagent with ID's not found: ${missingIds}`);
      }

      const [order] = await this.prisma.$transaction([
        this.prisma.order.create({
          data: {
            ...data,
            reagents: {
              connect: data.reagents.map((reagent) => ({ id: reagent.id })),
            },
          },
          include: {
            reagents: true,
          },
        }),

        this.prisma.reagentRequest.updateMany({
          where: {
            id: {
              in: requestedReagentIds,
            },
          },
          data: {
            status: Status.Ordered,
          },
        }),
      ]);

      this.logger.log(`[${this.create.name}] - Method finished`);
      return order;
    } catch (error) {
      this.logger.error(`[${this.create.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async update(order: PartialWithRequiredId<UpdateOrderData>): Promise<OrderWithReagents> {
    this.logger.log(`[${this.update.name}] - Method start`);
    try {
      const { includeReagents = [], excludeReagents = [], ...orderData } = order;
      const { status } = order;

      const requestedIncludeReagentIds: number[] = includeReagents.map((reagent) => reagent.id);
      const requestedExcludeReagentIds: number[] = excludeReagents.map((reagent) => reagent.id);

      const reagentsForExclude: ReagentRequest[] = await this.prisma.reagentRequest.findMany({
        where: {
          AND: [
            {
              id: {
                in: requestedExcludeReagentIds,
              },
            },
            {
              orderId: order.id,
            },
          ],
        },
      });
      const existingReagentIdsForExclude: number[] = reagentsForExclude.map((reagent) => reagent.id);
      const missingIdsForExclude: number[] = requestedExcludeReagentIds.filter(
        (id) => !existingReagentIdsForExclude.includes(id),
      );
      if (missingIdsForExclude.length > 0) {
        this.logger.error(`[${this.create.name}] - Exception thrown: invalid reagent ids`);
        throw new NotFoundException(
          `Order with id ${order.id} doesn't have the following reagent[s] - ${missingIdsForExclude} for excluding`,
        );
      }

      await this.prisma.$transaction([
        this.prisma.order.update({
          where: {
            id: order.id,
          },
          data: {
            reagents: {
              disconnect: reagentsForExclude.map((reagent) => ({ id: reagent.id })),
            },
          },
        }),

        this.prisma.reagentRequest.updateMany({
          where: {
            id: {
              in: existingReagentIdsForExclude,
            },
          },
          data: {
            status: Status.Pending,
          },
        }),
      ]);

      const reagentsForInclude = await this.prisma.reagentRequest.findMany({
        where: {
          AND: [
            {
              id: {
                in: requestedIncludeReagentIds,
              },
            },
          ],
        },
        include: {
          order: true,
        },
      });

      const reagentIdsForInclude: number[] = reagentsForInclude.map((reagent) => {
        if (reagent.order && reagent.order.status === Status.Submitted) {
          throw new BadRequestException(
            `reagent with id ${reagent.id} can't be included because it belongs to order ${reagent.order.id} which is Submitted`,
          );
        }
        return reagent.id;
      });

      const existingReagentForInclude = await this.prisma.reagentRequest.findMany({
        where: {
          id: {
            in: reagentIdsForInclude,
          },
        },
        select: {
          id: true,
        },
      });

      const existingReagentIdsForInclude: number[] = existingReagentForInclude.map((reagent) => reagent.id);
      const missingIds: number[] = requestedIncludeReagentIds.filter((id) => !existingReagentIdsForInclude.includes(id));
      if (missingIds.length > 0) {
        this.logger.error(`[${this.create.name}] - Exception thrown: invalid reagent ids`);
        throw new NotFoundException(`The following reagent IDs not found: ${missingIds} for including`);
      }

      await this.prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          reagents: {
            connect: existingReagentForInclude.map((reagent) => ({ id: reagent.id })),
          },
        },
        include: {
          reagents: true,
        },
      });

      if (status === Status.Declined) {
        await this.prisma.reagentRequest.updateMany({
          where: {
            orderId: order.id,
          },
          data: {
            status: Status.Pending,
          },
        });
      } else if (status === Status.Fulfilled) {
        await this.prisma.reagentRequest.updateMany({
          where: {
            orderId: order.id,
          },
          data: {
            status: Status.Fulfilled,
          },
        });
      }

      const updatedOrder: OrderWithReagents = await this.prisma.order.update({
        where: { id: order.id },
        data: {
          seller: orderData.seller,
          title: orderData.title,
          status: orderData.status,
        },
        include: {
          reagents: true,
        },
      });
      this.logger.log(`[${this.update.name}] - Method finished`);
      return updatedOrder;
    } catch (error) {
      this.logger.error(`[${this.update.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async upsert(order: Order): Promise<void> {
    this.logger.log(`[${this.upsert.name}] - Method start`);
    try {
      await this.prisma.order.upsert({
        where: { id: order.id },
        update: {
          ...order,
        },
        create: {
          ...order,
        },
      });
      this.logger.log(`[${this.upsert.name}] - Method finished`);
    } catch (error) {
      this.logger.error(`[${this.upsert.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async delete(id: number): Promise<OrderWithReagents> {
    this.logger.log(`[${this.delete.name}] - Method start`);
    try {
      const deletedOrder: OrderWithReagents = await this.prisma.order.delete({
        where: { id },
        include: {
          reagents: true,
        },
      });
      this.logger.log(`[${this.delete.name}] - Method finished`);
      return deletedOrder;
    } catch (error) {
      this.logger.error(`[${this.delete.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  private orderFactory(sortOptions: OrderSortOptions | undefined): OrderBy {
    this.logger.log(`[${this.orderFactory.name}] - Method start`);
    try {
      if (!sortOptions) return undefined;
      const orderBy: OrderBy = {};

      const chronologicalOptions = sortOptions.chronologicalDate;
      const alphabeticalOptions = sortOptions.alphabetical;

      switch (true) {
        case !!chronologicalOptions?.updatedAt:
          orderBy.updatedAt = chronologicalOptions.updatedAt;
          break;
        case !!chronologicalOptions?.createdAt:
          orderBy.createdAt = chronologicalOptions.createdAt;
          break;
        case !!alphabeticalOptions?.seller:
          orderBy.seller = alphabeticalOptions.seller;
          break;
        case !!alphabeticalOptions?.title:
          orderBy.title = alphabeticalOptions.title;
          break;
        default:
          break;
      }
      this.logger.log(`[${this.orderFactory.name}] - Method finished`);
      return Object.keys(orderBy).length > 0 ? orderBy : undefined;
    } catch (error) {
      this.logger.error(`[${this.orderFactory.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }
}

const ORDER_REPOSITORY_TOKEN = Symbol('ORDER_REPOSITORY_TOKEN');
const OrderRepositoryProvider = {
  provide: ORDER_REPOSITORY_TOKEN,
  useClass: OrderRepository,
};

export { OrderRepositoryProvider, ORDER_REPOSITORY_TOKEN };
