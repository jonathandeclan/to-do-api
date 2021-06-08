import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from '../models/todo.entity';
export class SetStatusInputDTO {
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
