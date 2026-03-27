import { PartialType } from '@nestjs/mapped-types';
import { CreateOnboardingDto } from './create-onboarding.dto';
import { IsNumber, IsOptional, IsObject } from 'class-validator';

export class UpdateOnboardingDto extends PartialType(CreateOnboardingDto) {
  @IsOptional()
  @IsNumber()
  currentStep?: number;

  @IsOptional()
  @IsObject()
  screening?: any;
}
