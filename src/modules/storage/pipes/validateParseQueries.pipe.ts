import { Injectable, PipeTransform, BadRequestException, HttpStatus } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { GetStoragesQueryDto } from '../dto/getStorage.dto';
import { StorageFilterOptions, StoragePaginationOptions, StorageSortOptions, StorageOptions } from '../types/storageOptions.type';

@Injectable()
export class ValidateParseStorageOptionsPipe implements PipeTransform {
  async transform(queries: any): Promise<StorageOptions> {
    const queryDto = plainToClass(GetStoragesQueryDto, queries);

    const errors: ValidationError[] = await validate(queryDto);

    if (errors.length > 0) {
      const messages: string[] = [];

      errors.forEach((error: ValidationError) => {
        if (error.constraints) {
          Object.values(error.constraints).forEach((constraintMessage) => {
            messages.push(constraintMessage);
          });
        }
      });

      throw new BadRequestException({
        message: messages,
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
      });
    }

    if (
      (queryDto.alphabeticalStorageName && (queryDto.chronologicalDate || queryDto.alphabeticalRoomName)) ||
      (queryDto.chronologicalDate && queryDto.alphabeticalRoomName)
    ) {
      throw new BadRequestException({
        message: 'Only one of alphabeticalStorageName, alphabeticalRoomName, or chronologicalDate must be provided',
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
      });
    }

    const filters: StorageFilterOptions = {
      fullPath: queryDto.fullPath?.trim(),
      roomName: queryDto.roomName?.trim(),
      storageName: queryDto.storageName?.trim(),
    };
    const sorts: StorageSortOptions = {
      alphabeticalStorageName: queryDto.alphabeticalStorageName,
      alphabeticalRoomName: queryDto.alphabeticalRoomName,
      chronologicalDate: queryDto.chronologicalDate,
    };

    const paginations: StoragePaginationOptions = {
      skip: queryDto.skip,
      take: queryDto.take,
    };

    const options: StorageOptions = {
      filter: filters,
      sort: sorts,
      pagination: paginations,
    };

    return options;
  }
}
