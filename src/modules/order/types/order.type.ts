import { Order, Prisma, ReagentRequest } from '@prisma/client';
import { CreateOrderDto, ReagentIdsDto } from '../dto/createOrder.dto';

type OnlyReagentId = {
  id: number;
};

type OrderWithReagents = Order & {
  reagents: ReagentRequest[];
};

type OrderWithReagentCountObject = Prisma.OrderGetPayload<{
  include: {
    reagents: true;
    _count: {
      select: {
        reagents: true;
      };
    };
  };
}>;

type OrderIdMappedWithReagentIds = {
  orderId: number;
  matchedReagentRequestIds: number[];
};

type OrderWithReagentCount = OrderWithReagents & {
  reagentCount: number;
};

type OrderList = {
  orders: OrderWithReagents[];
  size: number;
};

type CompleteOrderData = CreateOrderDto & {
  userId: number;
};

type UpdateOrderData = Order & {
  includeReagents: ReagentIdsDto[];
  excludeReagents: ReagentIdsDto[];
};

export {
  OrderWithReagents,
  OrderList,
  CompleteOrderData,
  OnlyReagentId,
  OrderWithReagentCountObject,
  OrderWithReagentCount,
  OrderIdMappedWithReagentIds,
  UpdateOrderData,
};
