import { IsString, IsEmail, IsNumber, IsOptional, IsObject } from 'class-validator';

export class CreateOnboardingDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  age: number;

  @IsString()
  country: string;

  @IsOptional()
  @IsObject()
  screening?: any;

  @IsOptional()
  @IsString()
  plan?: string;
}
