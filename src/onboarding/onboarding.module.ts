import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { Onboarding } from './entities/onboarding.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Onboarding])],
  controllers: [OnboardingController],
  providers: [OnboardingService]
})
export class OnboardingModule {}
