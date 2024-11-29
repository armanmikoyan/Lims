import { CreateSampleDto } from '../dto/createSample.dto';
import { IReagent } from './reagentEntity.interface';

export interface ISampleService {
  create(data: CreateSampleDto): Promise<IReagent>;
}
