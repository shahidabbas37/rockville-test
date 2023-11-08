import {
  IsString,
  IsEmail,
  Matches,
  IsDate,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Name should contain only letters and spaces',
  })
  name: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  @Matches(/^(?=.*\d).{6,}$/, {
    message: 'Password should be at least 6 characters and include at least one number',
  })
  password: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  profileImage: string;

  @IsDate()
  @Type(() => Date)
  dob: Date;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  favCategories: string[];
}
