import { IReagentRequest } from '../interfaces/reagentRequestEntity.interface';

export function getRequestForUser(userId: number, list: IReagentRequest[]): IReagentRequest[] {
  return list.filter((request) => request.userId === userId);
}

export function getRequestById(reqId: number, list: IReagentRequest[]): IReagentRequest | undefined {
  return list.find((request) => request.id === reqId);
}
