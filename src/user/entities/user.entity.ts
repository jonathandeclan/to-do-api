import { Todo } from 'src/todo/entities/todo.entity';
import { JoinTable } from 'typeorm';
import { ManyToMany } from 'typeorm';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  //todos
  @OneToMany(() => Todo, (todo) => todo.owner)
  todos: Todo[];

  // friend relation
  @ManyToMany(() => User, (user) => user.friendOf)
  @JoinTable()
  friends: User[];

  @ManyToMany(() => User, (user) => user.friends)
  friendOf: User[];
}
