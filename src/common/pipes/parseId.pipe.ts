import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('Value is required.');
    }
    const isValidInteger = /^\d+$/.test(value);
    const parsedValue = isValidInteger ? parseInt(value, 10) : NaN;

    if (!isValidInteger || isNaN(parsedValue) || parsedValue === 0) {
      throw new BadRequestException(`Invalid value for parameter "${metadata.data}": "${value}" is not a valid id.`);
    }

    return parsedValue;
  }
}
