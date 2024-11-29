import { StatusService } from './status.service';
import { StatusORMService } from './orm/orm.service';

export { StatusORMService, StatusService };

export const SERVICES = [StatusORMService, StatusService];
