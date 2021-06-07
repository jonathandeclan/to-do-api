import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status, Todo } from './models/todo.entity';
import { UpdateResult, DeleteResult } from 'typeorm';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private todoRespository: Repository<Todo>,
  ) {}

  public async createTodo(todo: Todo): Promise<Todo> {
    return await this.todoRespository.save(todo);
  }

  public async getTodos(): Promise<Todo[]> {
    return await this.todoRespository.find();
  }

  public async deleteTodoById(id): Promise<DeleteResult> {
    return await this.todoRespository.delete(id);
  }

  public async markTodoAsDone(id): Promise<UpdateResult> {
    return await this.todoRespository.update(id, { status: Status.DONE });
  }
}
