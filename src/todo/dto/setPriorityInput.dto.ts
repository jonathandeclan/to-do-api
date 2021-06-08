import { IsEnum, IsNotEmpty } from 'class-validator';
import { Priority } from '../models/todo.entity';
export class SetPriorityInputDTO {
  @IsEnum(Priority)
  @IsNotEmpty()
  priority: Priority;
}
