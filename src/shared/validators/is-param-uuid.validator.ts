import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import validator from 'validator';
export class IsParamUUID implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    if (!validator.isUUID(value)) {
      throw new BadRequestException(`The ${value} does'nt a valid UUID `);
    }

    return value;
  }
}
