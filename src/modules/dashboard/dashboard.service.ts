import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AdminReturnObject,
  IDashboardService,
  ProcurementOfficerReturnObject,
  ResearcherReturnObject,
} from './interfaces/dashboardService.interface';
import { IReagent } from '../reagent/interfaces/reagentEntity.interface';
import { IReagentRequest } from '../reagentRequest/interfaces/reagentRequestEntity.interface';

@Injectable()
class DashboardService implements IDashboardService {
  private readonly logger: Logger = new Logger(DashboardService.name);

  constructor(private readonly prisma: PrismaService) {}

  async adminDashboard(): Promise<AdminReturnObject> {
    try {
      this.logger.log(`${this.adminDashboard.name} - Start`);
      const roomNumber = await this.prisma.room.count({
        where: {},
      });
      const storageNumber = await this.prisma.storage.count();
      const userNumber = await this.prisma.user.count();
      const storageNumberInRoom = await this.prisma.storage.groupBy({
        by: ['roomId'],
        _count: { id: true },
      });
      const storageCountWithRoomNames = await Promise.all(
        storageNumberInRoom.map(async (group) => {
          const room = await this.prisma.room.findUnique({
            where: { id: group.roomId },
          });
          return {
            roomName: room?.name,
            storageCount: group._count.id,
          };
        }),
      );
      const userNumberInRoles = await this.prisma.user.groupBy({
        by: ['role'],
        _count: { id: true },
      });
      this.logger.log(`${this.adminDashboard.name} - Finished`);
      return {
        roomNumber,
        storageNumber,
        userNumber,
        storageCountWithRoomNames,
        userNumberInRoles,
      };
    } catch (error) {
      this.logger.error(`${this.adminDashboard.name} - Error - ${error}`);
      throw error;
    }
  }

  async researcherDashboard(year: number, month: number): Promise<ResearcherReturnObject> {
    try {
      this.logger.log(`${this.researcherDashboard.name} - Start`);
      if (month < 1 || month > 12) {
        throw new BadRequestException('Invalid month value. Must be between 1 and 12.');
      }
      const reagentsVsSampleNumber = await this.prisma.reagent.groupBy({
        by: ['category'],
        _count: { id: true },
      });
      const reagentsVsSampleExpiredNumber = await this.prisma.reagent.groupBy({
        by: ['category'],
        where: {
          expirationDate: {
            gt: new Date(),
          },
        },
        _count: { id: true },
      });
      const reagentsVsSampleEmptyNumber = await this.prisma.reagent.groupBy({
        by: ['category'],
        where: {
          quantityLeft: 0,
        },
        _count: { id: true },
      });
      const threeDaysLater = new Date();
      threeDaysLater.setDate(threeDaysLater.getDate() + 3);
      const expiredList: IReagent[] = await this.prisma.reagent.findMany({
        where: {
          OR: [{ expirationDate: { gte: new Date() } }, { expirationDate: { lte: threeDaysLater } }],
        },
        take: 10,
      });
      const emptyOrExpiredList: IReagent[] = expiredList.filter(
        (reagent) => reagent.quantityLeft <= reagent.totalQuantity / 2 || reagent.quantityLeft === 0,
      );
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      const requestList: IReagentRequest[] = await this.prisma.reagentRequest.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      });
      this.logger.log(`${this.researcherDashboard.name} - Finish`);
      return {
        reagentsVsSampleNumber,
        reagentsVsSampleExpiredNumber,
        reagentsVsSampleEmptyNumber,
        emptyOrExpiredList,
        requestList,
      };
    } catch (error) {
      this.logger.error(`${this.researcherDashboard.name} - Error - ${error}`);
      throw error;
    }
  }

  async procurementOficcerDashboard(year: number, month: number): Promise<ProcurementOfficerReturnObject> {
    try {
      this.logger.log(`${this.procurementOficcerDashboard.name} - Start`);
      if (month < 1 || month > 12) {
        throw new BadRequestException('Invalid month value. Must be between 1 and 12.');
      }
      const requestList: IReagentRequest[] = await this.prisma.reagentRequest.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      });
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      const requestByStatuses = await this.prisma.reagentRequest.groupBy({
        by: ['status'],
        _count: { id: true },
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      });
      this.logger.log(`${this.procurementOficcerDashboard.name} - Finish`);
      return {
        requestList,
        requestByStatuses,
      };
    } catch (error) {
      this.logger.error(`${this.procurementOficcerDashboard.name} - Error - ${error}`);
      throw error;
    }
  }
}

export const DASHBOARD_SERVICE_TOKEN = Symbol('DASHBOARD_SERVICE_TOKEN');
export const DashboardServiceProvider = {
  provide: DASHBOARD_SERVICE_TOKEN,
  useClass: DashboardService,
};
