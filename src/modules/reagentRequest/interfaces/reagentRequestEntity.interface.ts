import { Package, Status } from '@prisma/client';

export interface IReagentRequest {
  id?: number;
  name: string;
  userId: number;
  desiredQuantity: number;
  quantityUnit: string;
  structureSmiles?: string | null;
  casNumber?: string | null;
  userComments?: string | null;
  procurementComments?: string | null;
  status?: Status;
  package?: Package | null;
  createdAt?: Date;
  updatedAt?: Date;
  orderId?: number | null;
  producer?: string | null;
  catalogId?: string | null;
  catalogLink?: string | null;
  pricePerUnit?: number | null;
  expirationDate?: Date | null;
}
