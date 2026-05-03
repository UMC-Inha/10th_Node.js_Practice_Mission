import { IsDefined } from 'class-validator';
import { IsArray } from 'class-validator';

export class UserSignUpResponse {
  @IsDefined()
  email!: string;

  @IsDefined()
  name!: string;

  @IsDefined()
  gender!: string;

  @IsDefined()
  birth!: Date;
  
  @IsDefined()
  address!: string;
  
  @IsDefined()
  detailAddress!: string;

  @IsDefined()
  phoneNumber!: string;

  @IsDefined()
  @IsArray()
  @IsDefined()
  preferences!: string[];
}
