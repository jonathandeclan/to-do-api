import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Priority, Status, Todo } from './models/todo.entity';
import { UpdateResult, DeleteResult } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private todoRespository: Repository<Todo>,
  ) {}

  public async createTodo(todo: Todo): Promise<Todo> {
    return await this.todoRespository.save(todo);
  }

  public async getTodo(id): Promise<Todo> {
    const todo = await this.todoRespository.findOne(id);
    if (typeof todo === 'undefined') {
      throw new NotFoundException();
    }
    return todo;
  }

  public async paginate(
    options: IPaginationOptions,
    inputStatus: Status,
    inputPriority: Priority,
  ): Promise<Pagination<Todo>> {
    const queryBuilder = this.todoRespository.createQueryBuilder('todo');
    // check for optional filters status and priority
    if (typeof inputStatus !== 'undefined' && inputStatus !== null) {
      //   console.log('inputStatus: ' + inputStatus);
      queryBuilder.where('todo.status = :status', { status: inputStatus });
    }
    if (typeof inputPriority !== 'undefined' && inputPriority !== null) {
      //   console.log('inputPriority: ' + inputPriority);
      queryBuilder.where('todo.priority = :priority', {
        priority: inputPriority,
      });
    }
    queryBuilder.orderBy('todo.dueDate', 'ASC', 'NULLS LAST');
    queryBuilder.addOrderBy('todo.priority', 'ASC');
    return paginate<Todo>(queryBuilder, options);
  }

  public async deleteTodoById(id): Promise<DeleteResult> {
    return await this.todoRespository.delete(id);
  }

  public async markTodoAsDone(id): Promise<UpdateResult> {
    return await this.todoRespository.update(id, { status: Status.DONE });
  }

  public async setPriority(id, priority: Priority): Promise<UpdateResult> {
    return await this.todoRespository.update(id, { priority: priority });
  }

  public async setDueDate(id, dueDate: Date): Promise<UpdateResult> {
    return await this.todoRespository.update(id, { dueDate: dueDate });
  }

  public async setStatus(id, status: Status): Promise<UpdateResult> {
    return await this.todoRespository.update(id, { status: status });
  } //TO-DO: possible to combine update functions into one
}
