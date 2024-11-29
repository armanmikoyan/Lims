import { Prisma, Reagent, Storage } from '@prisma/client';

type StorageWithReagents = Storage & {
  reagents: Reagent[];
};

type StorageWithReagentCountObject = Prisma.StorageGetPayload<{
  include: {
    _count: {
      select: {
        reagents: true;
      };
    };
  };
}>;

type StorageWithReagentCount = Storage & {
  reagentCount: number;
};

type StorageCreation = {
  roomId: number;
  name: string;
  description?: string | null;
};

type UpdatedStorages = {
  updatedDestinationStorage: StorageWithReagents;
  updatedSourceStorage: StorageWithReagents;
};

type FilterBy = {
  roomIds?: number[] | undefined;
  name?: string | undefined;
};

type StorageList = {
  size: number;
  storages: Storage[];
};

export {
  StorageWithReagents,
  StorageCreation,
  FilterBy,
  StorageList,
  StorageWithReagentCount,
  StorageWithReagentCountObject,
  UpdatedStorages,
};
