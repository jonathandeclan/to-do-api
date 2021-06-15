import { IsBoolean, IsNotEmpty } from 'class-validator';
export class SetPrivateInputDTO {
  @IsBoolean()
  @IsNotEmpty()
  private: boolean;
}
