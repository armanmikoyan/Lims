import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ORDER_REPOSITORY_TOKEN } from './order.repository';
import { IOrderService } from './interfaces/orderService.interface';
import { IOrderRepository } from './interfaces/orderRepository.interface';
import { CompleteOrderData, OrderList, OrderWithReagents } from './types/order.type';
import { OrdereOptions } from './types/orderOptions.type';
import { Status } from '@prisma/client';
import { UpdateOrderDto } from './dto/updateOrder.dto';

@Injectable()
export class OrderService implements IOrderService {
  private readonly logger: Logger = new Logger(OrderService.name);

  constructor(@Inject(ORDER_REPOSITORY_TOKEN) private orderRepository: IOrderRepository) {}

  async createOrder(orderDto: CompleteOrderData): Promise<OrderWithReagents> {
    try {
      this.logger.log(`[${this.createOrder.name}] - Method start`);
      const order: OrderWithReagents = await this.orderRepository.create(orderDto);
      this.logger.log(`[${this.createOrder.name}] - Method finished`);
      return order;
    } catch (error) {
      this.logger.error(`[${this.createOrder.name}] - Exception thrown: ` + error);
      throw error;
    }
  }

  async orderList(options: OrdereOptions): Promise<OrderList> {
    try {
      this.logger.log(`[${this.orderList.name}] - Method start`);
      const { filter, pagination, sort } = options;
      const order: OrderList = await this.orderRepository.findAll(filter, pagination, sort);
      this.logger.log(`[${this.orderList.name}] - Method finished`);
      return order;
    } catch (error) {
      this.logger.error(`[${this.orderList.name}] - Exception thrown: ` + error);
      throw error;
    }
  }

  async getOrderById(id: number): Promise<OrderWithReagents | null> {
    this.logger.log(`[${this.getOrderById.name}] - Method start`);
    try {
      const order: OrderWithReagents | null = await this.orderRepository.findById(id, true);
      this.logger.log(`[${this.getOrderById.name}] - Method finished`);
      return order;
    } catch (error) {
      this.logger.error(`[${this.getOrderById.name}] - Exception thrown` + error);
      throw error;
    }
  }

  async updateOrder(id: number, data: UpdateOrderDto): Promise<OrderWithReagents> {
    this.logger.log(`[${this.updateOrder.name}] - Method start`);
    try {
      const { status } = data;
      const paramCount = Object.keys(data).length;

      const existingOrder = await this.orderRepository.findById(id);

      if (!existingOrder) {
        throw new NotFoundException(`Order not found`);
      }

      const currentStatus: Status = existingOrder.status;

      if (currentStatus === Status.Declined || currentStatus === Status.Fulfilled) {
        throw new BadRequestException(`${currentStatus} orders can't be edited`);
      }

      if (currentStatus === Status.Pending && status && status !== Status.Submitted) {
        throw new BadRequestException(`${currentStatus} orders can be changed only to ${Status.Submitted} status`);
      }

      if (currentStatus === Status.Submitted) {
        const isStatusAllowedToChange = status === Status.Fulfilled || status === Status.Declined;
        if (paramCount > 1 || !status || !isStatusAllowedToChange) {
          throw new BadRequestException(
            `Order with status ${Status.Submitted} cannot be modified. You can only change its status to ${Status.Fulfilled} or ${Status.Declined}. `,
          );
        }
      }

      const order: OrderWithReagents = await this.orderRepository.update({ id, ...data });
      this.logger.log(`[${this.updateOrder.name}] - Method finished`);
      return order;
    } catch (error) {
      this.logger.error(`[${this.updateOrder.name}] - Exception thrown: ` + error);
      throw error;
    }
  }
}

const ORDER_SERVICE_TOKEN = Symbol('ORDER_SERVICE_TOKEN');
const OrderServiceProvider = {
  provide: ORDER_SERVICE_TOKEN,
  useClass: OrderService,
};

export { OrderServiceProvider, ORDER_SERVICE_TOKEN };
