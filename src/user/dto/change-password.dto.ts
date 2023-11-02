import {
    IsString,
  } from 'class-validator';
  
  
  export class ChangePasswordDto {
    @IsString()
    previousPassword: string;
  
    @IsString()
    newPassword: string;
  }
  