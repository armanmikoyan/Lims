import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class StatusORMService {
  private _ormClient: PrismaClient = new PrismaClient();
  private _logger: Logger = new Logger(StatusORMService.name);

  public async dbHealthcheck() {
    this._logger.log('dbHealthcheck');

    try {
      await this._ormClient.$connect();
      await this._ormClient.$disconnect();

      return true;
    } catch (error) {
      this._logger.error(error);

      return false;
    }
  }
}
