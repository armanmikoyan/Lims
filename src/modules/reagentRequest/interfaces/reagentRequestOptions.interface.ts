import { Status } from '@prisma/client';

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

export type OrderBy = { desiredQuantity?: Order; createdAt?: Order; updatedAt?: Order } | undefined;

export type SortOptions = {
  sortByQuantity?: Order;
  sortByCreatedDate?: Order;
  sortByUpdatedDate?: Order;
};

export type PaginationOptions = {
  skip: number | undefined;
  take: number | undefined;
};

export type FilterOptions = {
  status?: Status;
  name?: string;
};

export type ReagentRequestOptions = {
  filter: FilterOptions;
  sort: SortOptions;
  pagination: PaginationOptions;
};
