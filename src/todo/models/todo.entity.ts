import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

export enum Status {
  NOT_DONE = 'not done',
  DONE = 'done',
  IN_PROGRESS = 'in progress',
  UNDER_REVIEW = 'under review',
  BLOCKED = 'blocked',
}

export enum Priority {
  NORMAL = 1,
  HIGH = 0,
  LOW = 2,
}

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  title: string;

  @Column({ type: 'text', default: Status.NOT_DONE })
  status: Status;

  @Column({ type: 'int', default: Priority.NORMAL })
  priority: Priority;

  @Column({ type: 'datetime', nullable: true })
  dueDate: Date;
}
