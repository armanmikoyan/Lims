import { UpdateReagentRequestDto } from '../dto/updateReagentRequest.dto';
import { IReagentRequest } from './reagentRequestEntity.interface';
import { ReagentRequestOptions } from './reagentRequestOptions.interface';
import { RequestList } from './reagentRequestRepository.interface';

export interface IReagentRequestService {
  create(request: IReagentRequest): Promise<IReagentRequest>;
  getReagentRequestsForProcurementOficcer(options: ReagentRequestOptions): Promise<RequestList>;
  getReagentRequestsForResearchers(options: ReagentRequestOptions, id: number): Promise<RequestList>;
  getRequestById(id: number): Promise<IReagentRequest | null>;
  editReagentRequest(data: UpdateReagentRequestDto, id: number): Promise<IReagentRequest>;
}
