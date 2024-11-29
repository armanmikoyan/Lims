enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

type OrderBy =
  | {
      name?: Order;
      updatedAt?: Order;
      room?: { name?: Order };
    }
  | undefined;

type StorageSortOptions = {
  chronologicalDate?: Order | undefined;
  alphabeticalStorageName?: Order | undefined;
  alphabeticalRoomName?: Order | undefined;
};

type StorageFilterOptions = {
  fullPath?: string | undefined;
  roomName?: string | undefined;
  storageName?: string | undefined;
};

type StoragePaginationOptions = {
  skip?: number | undefined;
  take?: number | undefined;
};

type StorageOptions = {
  filter: StorageFilterOptions;
  sort: StorageSortOptions;
  pagination: StoragePaginationOptions;
};

export { StorageOptions, StorageFilterOptions, StorageSortOptions, StoragePaginationOptions, Order, OrderBy };
