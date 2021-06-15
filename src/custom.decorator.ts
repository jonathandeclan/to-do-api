import {
  createParamDecorator,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export const RequestHeader = createParamDecorator(
  //Removed ClassType<unknown>,, I don't think you need this here
  async (value: any, ctx: ExecutionContext) => {
    // extract headers
    const headers = ctx.switchToHttp().getRequest().headers;

    // Convert headers to DTO object
    const dto = plainToClass(value, headers, { excludeExtraneousValues: true });

    // Validate
    const errors: ValidationError[] = await validate(dto);

    if (errors.length > 0) {
      //Get the errors and push to custom array
      const validationErrors = errors.map((obj) =>
        Object.values(obj.constraints),
      );
      throw new HttpException(
        `Validation failed with following Errors: ${validationErrors}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // return header dto object
    return dto;
  },
);
