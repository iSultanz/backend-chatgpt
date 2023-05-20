import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('regulations-Inquiry')
export class RegulationsInquiryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'recommended', type: 'text', nullable: false })
  recommended: string;

  @Column({ name: 'inquiry', type: 'text', nullable: false })
  inquiry: string;

  @Column({ name: 'regulation', type: 'text', nullable: false })
  regulation: string;
}
