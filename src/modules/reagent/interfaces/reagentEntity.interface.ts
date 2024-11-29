import { Category, Package } from '@prisma/client';

export interface IReagent {
  id?: number;
  name: string;
  casNumber?: string | null;
  producer?: string | null;
  catalogId?: string | null;
  catalogLink?: string | null;
  pricePerUnit?: number | null;
  quantityUnit: string;
  totalQuantity: number;
  description?: string | null;
  quantityLeft: number;
  expirationDate?: Date | null;
  storageId: number;
  category: Category;
  package?: Package | null;
  structure?: string | null;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
