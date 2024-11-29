import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const logger = new Logger(StorageSeed.name);

export async function StorageSeed() {
  const numberOfRooms: number = 3;
  const numberOfCabinets: number = 5;
  const numberOfShelves: number = 10;
  const roomNames: string[] = [];
  
  for (let i = 1; i <= numberOfRooms; i++) {
    const roomName: string = `Room${i}`;
    roomNames.push(roomName);
    await prisma.room.upsert({
      where: { name: roomName },
      update: {},
      create: {
        name: roomName,
        description: `description for ${roomName}`
      },
    });
  }

  for (let i = 0; i < roomNames.length; i++) {
    const room = await prisma.room.findUnique({
      where: { name: roomNames[i] },
    });

    if (room) {
      for (let j = 1; j <= numberOfCabinets; j++) {
        const cabinetName: string = `Cabinet${j}`;
        for (let k = 1; k <= numberOfShelves; k++) {
          const shelfName: string = `Shelf${k}`;
          const storageName: string = `${cabinetName}-${shelfName}`;
          await prisma.storage.upsert({
            where: {
              roomId_name: {
                roomId: room.id,
                name: storageName,
              },
            },
            update: {},
            create: {
              roomId: room.id,
              name: storageName,
              description: `Description for ${storageName}`, 
            },
          });
        }
      }
    }
  }
  logger.log('Storage seed completed');
}
