import { IsEnum, IsNotEmpty } from 'class-validator';
import { Priority } from '../entities/todo.entity';
export class SetPriorityInputDTO {
  @IsEnum(Priority)
  @IsNotEmpty()
  priority: Priority;
}
