import { Prisma, Role } from '@prisma/client';
import { IReagent } from 'src/modules/reagent/interfaces/reagentEntity.interface';
import { IReagentRequest } from 'src/modules/reagentRequest/interfaces/reagentRequestEntity.interface';

export interface IDashboardService {
  adminDashboard(): Promise<AdminReturnObject>;
  researcherDashboard(year: number, month: number): Promise<ResearcherReturnObject>;
  procurementOficcerDashboard(year: number, month: number): Promise<ProcurementOfficerReturnObject>;
}

export type AdminReturnObject = {
  roomNumber: number;
  storageNumber: number;
  userNumber: number;
  storageCountWithRoomNames: {
    roomName: string | undefined;
    storageCount: number;
  }[];
  userNumberInRoles: {
    role: Role;
    _count: {
      id: number;
    };
  }[];
};

export type ResearcherReturnObject = {
  reagentsVsSampleNumber: (Prisma.PickEnumerable<Prisma.ReagentGroupByOutputType, 'category'[]> & {
    _count: {
      id: number;
    };
  })[];
  reagentsVsSampleExpiredNumber: (Prisma.PickEnumerable<Prisma.ReagentGroupByOutputType, 'category'[]> & {
    _count: {
      id: number;
    };
  })[];
  reagentsVsSampleEmptyNumber: (Prisma.PickEnumerable<Prisma.ReagentGroupByOutputType, 'category'[]> & {
    _count: {
      id: number;
    };
  })[];
  emptyOrExpiredList: IReagent[];
  requestList: IReagentRequest[];
};

export type ProcurementOfficerReturnObject = {
  requestList: IReagentRequest[];
  requestByStatuses: (Prisma.PickEnumerable<Prisma.ReagentRequestGroupByOutputType, 'status'[]> & {
    _count: {
      id: number;
    };
  })[];
};
