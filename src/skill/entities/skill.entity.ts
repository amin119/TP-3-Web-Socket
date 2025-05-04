import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  Designation: string;
}
