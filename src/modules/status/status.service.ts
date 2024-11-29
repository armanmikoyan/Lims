import { Injectable, Logger } from '@nestjs/common';
import { BffHealthCheck, STATUS } from './entities';
import { StatusORMService } from './orm/orm.service';

@Injectable()
export class StatusService {
  private readonly _logger: Logger = new Logger(StatusService.name);

  constructor(private _orm: StatusORMService) {}

  public async getBffHealthcheck(): Promise<BffHealthCheck> {
    this._logger.log('getBffHealthcheck');

    try {
      const isDBConnectionOk = await this._orm.dbHealthcheck();

      return {
        status: STATUS.OK,
        connections: {
          db: isDBConnectionOk ? STATUS.OK : STATUS.FAILED,
        },
      };
    } catch (error) {
      this._logger.error(error);

      return {
        status: STATUS.FAILED,
      };
    }
  }
}
