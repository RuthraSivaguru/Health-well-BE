import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OnboardingService } from './onboarding.service';
import { Onboarding } from './entities/onboarding.entity';
import { Repository } from 'typeorm';

describe('OnboardingService - validateEligibility', () => {
  let service: OnboardingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OnboardingService,
        {
          provide: getRepositoryToken(Onboarding),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<OnboardingService>(OnboardingService);
  });

  it('should be eligible if no conditions', () => {
    const res = service.validateEligibility({});
    expect(res.eligible).toBe(true);
  });

  it('should be eligible if condition array is empty', () => {
    const res = service.validateEligibility({ conditions: [] });
    expect(res.eligible).toBe(true);
  });

  it('should be ineligible for uncontrolled diabetes', () => {
    const res = service.validateEligibility({
      conditions: ['Diabetes'],
      diabetesControl: false,
    });
    expect(res.eligible).toBe(false);
    expect(res.reason).toBe('Diabetes not controlled');
  });

  it('should be eligible for controlled diabetes', () => {
    const res = service.validateEligibility({
      conditions: ['Diabetes'],
      diabetesControl: true,
    });
    expect(res.eligible).toBe(true);
  });

  it('should be ineligible for recent cardiac event', () => {
    const res = service.validateEligibility({
      conditions: ['Heart Disease'],
      cardiacEvent: true,
    });
    expect(res.eligible).toBe(false);
    expect(res.reason).toBe('Recent cardiac event');
  });

  it('should be ineligible for high combined risk', () => {
    const res = service.validateEligibility({
      conditions: ['Diabetes', 'High Blood Pressure', 'Sleep Apnea'],
      diabetesControl: true,
      cardiacEvent: false,
    });
    expect(res.eligible).toBe(false);
    expect(res.reason).toBe('High combined risk');
  });

  it('should be eligible if mixed conditions without trigger', () => {
    const res = service.validateEligibility({
      conditions: ['High Blood Pressure', 'Sleep Apnea'],
    });
    expect(res.eligible).toBe(true);
  });
});
