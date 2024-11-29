import { Prisma, Room, Storage } from '@prisma/client';

type RoomWithStorages = Room & {
  storages: Storage[];
};

type RoomWithStorageCountObject = Prisma.RoomGetPayload<{
  include: {
    _count: {
      select: {
        storages: true;
      };
    };
  };
}>;

type RoomWithStorageCount = Room & {
  storageCount: number;
};

type IdOnly = {
  id: number;
};

export { RoomWithStorages, IdOnly, RoomWithStorageCountObject, RoomWithStorageCount };
