import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('specialist')
export class SpecialistEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'text', nullable: false })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: false })
  description: string;

  @Column({
    name: 'embedding',
    type: 'decimal',
    nullable: false,
    array: true,
  })
  embedding: number[];
}
