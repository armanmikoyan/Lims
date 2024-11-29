import { STATUS } from './status.entity';

export type BffHealthCheck = {
  status: STATUS;
  connections?: {
    db: STATUS;
  };
};
