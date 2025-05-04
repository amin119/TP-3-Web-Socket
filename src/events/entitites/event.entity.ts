import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // e.g., 'CV_CREATED', 'CV_UPDATED', 'CV_DELETED'

  @Column()
  userId: number;

  @Column({ nullable: true })
  cvId?: number;

  @Column({ type: 'json', nullable: true })
  details?: any;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}