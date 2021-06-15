import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Priority, Status, Todo } from './entities/todo.entity';
import { UpdateResult, DeleteResult } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
  paginateRawAndEntities,
} from 'nestjs-typeorm-paginate';
import { User } from 'src/user/entities/user.entity';
import { CreateTodoDTO } from './dto/create-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private todoRespository: Repository<Todo>,
    @InjectRepository(User) private userRespository: Repository<User>,
  ) {}

  public async createTodo(
    userId: string,
    createTodoInput: CreateTodoDTO,
  ): Promise<Todo> {
    // Check if user exists
    const user = await this.userRespository.findOne(userId);
    if (typeof user === 'undefined') {
      // No such user
      throw new BadRequestException();
    }
    const todo = new Todo();
    todo.owner = user;
    todo.title = createTodoInput.title;
    todo.status = createTodoInput.status;
    todo.dueDate = createTodoInput.dueDate;
    todo.priority = createTodoInput.priority;
    return await this.todoRespository.save(todo);
  }

  private async getTodoAndCheckPermission(
    userId: string,
    todoId: string,
  ): Promise<Todo> {
    // private function to check if user Id is the owner or a friend of the owner
    const todo = await this.todoRespository.findOne(todoId, {
      relations: ['owner', 'owner.friends'],
    });
    if (typeof todo === 'undefined') {
      throw new NotFoundException();
    }
    const owner: User = todo.owner;
    // check if user is the owner or if user is a friend
    const userIndex = owner.friends.findIndex((user) => user.id === userId);
    if (userId === owner.id || userIndex !== -1) {
      // permitted
      return todo;
    } else {
      // not permitted
      throw new NotFoundException();
    }
  }

  public async getTodo(userId: string, id: string): Promise<Todo> {
    const todo = await this.getTodoAndCheckPermission(userId, id);
    return todo;
  }

  public async paginate(
    userId: string,
    options: IPaginationOptions,
    inputStatus: Status,
    inputPriority: Priority,
  ): Promise<[Pagination<Todo>, Partial<Todo>[]]> {
    const queryBuilder = this.todoRespository.createQueryBuilder('todo');

    queryBuilder.leftJoinAndSelect('todo.owner', 'owner');
    queryBuilder.leftJoinAndSelect('owner.friends', 'friend');
    queryBuilder.where('owner.id = :userId', { userId: userId });
    queryBuilder.orWhere(
      new Brackets((qb) => {
        qb.where('friend.id = :friendId', { friendId: userId }).andWhere(
          'private = :private',
          { private: false },
        );
      }),
    );
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
    return paginateRawAndEntities(queryBuilder, options);
  }

  public async deleteTodoById(
    userId: string,
    id: string,
  ): Promise<DeleteResult> {
    await this.getTodoAndCheckPermission(userId, id);
    return await this.todoRespository.delete(id);
  }

  public async markTodoAsDone(
    userId: string,
    id: string,
  ): Promise<UpdateResult> {
    await this.getTodoAndCheckPermission(userId, id);
    return await this.todoRespository.update(id, { status: Status.DONE });
  }

  public async setPriority(
    userId: string,
    id: string,
    priority: Priority,
  ): Promise<UpdateResult> {
    await this.getTodoAndCheckPermission(userId, id);
    return await this.todoRespository.update(id, { priority: priority });
  }

  public async setDueDate(
    userId: string,
    id: string,
    dueDate: Date,
  ): Promise<UpdateResult> {
    await this.getTodoAndCheckPermission(userId, id);
    return await this.todoRespository.update(id, { dueDate: dueDate });
  }

  public async setStatus(
    userId: string,
    id: string,
    status: Status,
  ): Promise<UpdateResult> {
    await this.getTodoAndCheckPermission(userId, id);
    return await this.todoRespository.update(id, { status: status });
  }

  public async setPrivate(
    userId: string,
    id,
    privateTodo: boolean,
  ): Promise<UpdateResult> {
    await this.getTodoAndCheckPermission(userId, id);
    return await this.todoRespository.update(id, { private: privateTodo });
  } //TO-DO: possible to combine update functions into one
}
