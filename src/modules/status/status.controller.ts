import { Controller, Get, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { StatusService } from './status.service';
import { BffHealthCheck } from './entities';

@Controller('status')
export class StatusController {
  private readonly _logger: Logger = new Logger(StatusController.name);

  constructor(private readonly _statusService: StatusService) {}

  @Get('/healthcheck')
  public async getBffHealthcheck(): Promise<BffHealthCheck> {
    this._logger.log('getBffHealthcheck');

    try {
      const status = await this._statusService.getBffHealthcheck();

      return status;
    } catch (error) {
      this._logger.error(error);

      throw new HttpException(
        'Unexpected behaviour! Sometinhg went wrong, please look to the logs',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }
}
