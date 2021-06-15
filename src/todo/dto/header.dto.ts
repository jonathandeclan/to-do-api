import { Expose } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class HeaderDTO {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Expose({ name: 'x-user-id' }) // required as headers are case insensitive
  userIdHeader: string;
}
