import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { REQUEST_REPOSITORY_TOKEN } from './reagentRequest.repository';
import { IReagentRequest } from './interfaces/reagentRequestEntity.interface';
import { IReagentRequestService } from './interfaces/reagentRequestService.interface';
import { ReagentRequestOptions } from './interfaces/reagentRequestOptions.interface';
import { IReagentRequestRepository, RequestList } from './interfaces/reagentRequestRepository.interface';
import { UpdateReagentRequestDto } from './dto/updateReagentRequest.dto';

@Injectable()
export class ReagentRequestService implements IReagentRequestService {
  private logger = new Logger(ReagentRequestService.name);

  constructor(@Inject(REQUEST_REPOSITORY_TOKEN) private requestRepository: IReagentRequestRepository) {}

  async create(request: IReagentRequest): Promise<IReagentRequest> {
    try {
      this.logger.log('Create method start');
      const reagentRequest = await this.requestRepository.create(request);
      this.logger.log('Create method end');
      return reagentRequest;
    } catch (error) {
      this.logger.error('Failed to create Reagent Request: ', error);
      throw new InternalServerErrorException('Failed to create a Reagent Request!');
    }
  }

  async getReagentRequestsForProcurementOficcer(options: ReagentRequestOptions): Promise<RequestList> {
    try {
      this.logger.log(`${this.getReagentRequestsForProcurementOficcer.name} - Start`);
      const { filter, pagination, sort } = options || {};
      return await this.requestRepository.findAll(filter, pagination, sort);
    } catch (error) {
      this.logger.error('Failed to fetch Reagent Requests: ', error);
      throw new InternalServerErrorException('Failed to fetch a Reagent Requests!');
    }
  }

  async getReagentRequestsForResearchers(options: ReagentRequestOptions, id: number): Promise<RequestList> {
    try {
      this.logger.log(`${this.getReagentRequestsForResearchers.name} - Start`);
      const { filter, pagination, sort } = options || {};
      return await this.requestRepository.findAll(filter, pagination, sort, id);
    } catch (error) {
      this.logger.error('Failed to fetch Reagent Requests: ', error);
      throw new InternalServerErrorException('Failed to fetch a Reagent Requests!');
    }
  }

  async getRequestById(id: number): Promise<IReagentRequest | null> {
    try {
      this.logger.log(`${this.getRequestById.name} START`);
      return await this.requestRepository.findById(id);
    } catch (error) {
      this.logger.error('Failed to fetch Reagent Request by ID: ', error);
      throw new InternalServerErrorException('Failed to fetch a Reagent Request by ID!');
    }
  }

  async editReagentRequest(data: UpdateReagentRequestDto, id: number): Promise<IReagentRequest> {
    try {
      return await this.requestRepository.updateById(data, id);
    } catch (error) {
      this.logger.error('Failed to edit Reagent Request: ', error);
      throw new InternalServerErrorException('Failed to edit a Reagent Request!');
    }
  }
}

const REQUEST_SERVICE_TOKEN = Symbol('REQUEST_SERVICE_TOKEN');
const RequestServiceProvider = {
  provide: REQUEST_SERVICE_TOKEN,
  useClass: ReagentRequestService,
};

export { REQUEST_SERVICE_TOKEN, RequestServiceProvider };
