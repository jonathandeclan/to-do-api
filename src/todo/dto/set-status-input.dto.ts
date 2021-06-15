import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from '../entities/todo.entity';
export class SetStatusInputDTO {
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
