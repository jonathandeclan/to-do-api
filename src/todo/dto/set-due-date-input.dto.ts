import { IsDateString, IsNotEmpty } from 'class-validator';
export class SetDueDateInputDTO {
  @IsDateString()
  @IsNotEmpty()
  date: Date;
}
