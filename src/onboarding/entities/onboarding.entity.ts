import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Onboarding {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  age: number;

  @Column()
  country: string;

  @Column("jsonb")
  screening: any;

  @Column({ type: 'varchar', nullable: true })
  plan: string | null;

  @Column({ default: 1 })
  currentStep: number;

  @Column({ default: true })
  isEligible: boolean;

  @Column({ type: 'varchar', nullable: true })
  ineligibleReason: string | null;
}
