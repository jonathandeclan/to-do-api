import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

export enum Status {
  NOT_DONE = 'not done',
  DONE = 'done',
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
}
