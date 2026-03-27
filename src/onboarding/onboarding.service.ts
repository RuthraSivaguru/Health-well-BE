import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';
import { UpdateOnboardingDto } from './dto/update-onboarding.dto';
import { Onboarding } from './entities/onboarding.entity';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectRepository(Onboarding)
    private readonly onboardingRepository: Repository<Onboarding>,
  ) {}

  validateEligibility(screeningDto: any): { eligible: boolean; reason?: string } {
    if (!screeningDto || !screeningDto.conditions || !Array.isArray(screeningDto.conditions)) {
      return { eligible: true };
    }

    if (screeningDto.conditions.includes('Diabetes') && !screeningDto.diabetesControl) {
      return { eligible: false, reason: 'Diabetes not controlled' };
    }

    if (screeningDto.conditions.includes('Heart Disease') && screeningDto.cardiacEvent) {
      return { eligible: false, reason: 'Recent cardiac event' };
    }

    const combo = ['Diabetes', 'High Blood Pressure', 'Sleep Apnea'];
    if (combo.every((c) => screeningDto.conditions.includes(c))) {
      return { eligible: false, reason: 'High combined risk' };
    }

    return { eligible: true };
  }

  async create(createOnboardingDto: CreateOnboardingDto) {
    let isEligible = true;
    let ineligibleReason: string | null = null;

    if (createOnboardingDto.screening) {
      const eligibility = this.validateEligibility(createOnboardingDto.screening);
      isEligible = eligibility.eligible;
      if (!isEligible) {
        ineligibleReason = eligibility.reason || null;
      }
    }

    const newRecord = this.onboardingRepository.create({
      ...createOnboardingDto,
      isEligible,
      ineligibleReason,
      currentStep: 1,
      screening: createOnboardingDto.screening || {},
    });

    return this.onboardingRepository.save(newRecord);
  }

  async findOne(id: number) {
    const record = await this.onboardingRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Onboarding record with ID ${id} not found`);
    }
    return record;
  }

  async update(id: number, updateOnboardingDto: UpdateOnboardingDto) {
    const record = await this.findOne(id);
    
    // Merge screening data if provided
    let updatedScreening = record.screening;
    if (updateOnboardingDto.screening) {
      updatedScreening = { ...record.screening, ...updateOnboardingDto.screening };
    }

    const { eligible, reason } = this.validateEligibility(updatedScreening);

    Object.assign(record, updateOnboardingDto);
    record.screening = updatedScreening;
    record.isEligible = eligible;
    record.ineligibleReason = reason || null;

    return this.onboardingRepository.save(record);
  }

  async submit(id: number) {
    const record = await this.findOne(id);
    
    if (!record.isEligible) {
      throw new BadRequestException(`Cannot submit: User is ineligible (${record.ineligibleReason})`);
    }

    // Example submit logic: could mark the final step, clear some status, etc.
    // Assuming submitting moves flow to a completed state
    // Just returning the finalized record for now
    return { success: true, record };
  }
}
