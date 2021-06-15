import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Priority, Status } from '../entities/todo.entity';

export class CreateTodoDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @IsOptional()
  @IsBoolean()
  private?: boolean;
}
