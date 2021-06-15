import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { Priority, Status } from './entities/todo.entity';
import { TodoService } from './todo.service';
import { SetPriorityInputDTO } from './dto/set-priority-input.dto';
import { SetDueDateInputDTO } from './dto/set-due-date-input.dto';
import { SetStatusInputDTO } from './dto/set-status-input.dto';
import { HeaderDTO } from './dto/header.dto';
import { RequestHeader } from 'src/custom.decorator';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { SetPrivateInputDTO } from './dto/set-private-input.dto';

@Controller('todos')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  async getTodos(
    @RequestHeader(HeaderDTO) headers: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('status') status: Status,
    @Query('priority') priority: Priority,
  ) {
    const userId = headers.userIdHeader;
    limit = limit > 100 ? 100 : limit; //hard-limit TO-DO: configure via env variable?

    const [pagination, rawResults] = await this.todoService.paginate(
      userId,
      {
        page,
        limit,
      },
      status,
      priority,
    );
    pagination.items.map((item, index) => {
      // remove details of friends in todo
      delete item.owner.friends;
      delete item.owner.friendOf;
    });

    return pagination;
  }

  @Get(':id')
  async getTodo(
    @RequestHeader(HeaderDTO) headers: any,
    @Param('id') id,
  ): Promise<any> {
    const userId = headers.userIdHeader;
    const todo = await this.todoService.getTodo(userId, id);
    // remove details of friends in todo
    delete todo.owner.friends;
    delete todo.owner.friendOf;
    return todo;
  }

  @Post()
  async createTodo(
    @RequestHeader(HeaderDTO) headers: any,
    @Body() input: CreateTodoDTO,
  ): Promise<any> {
    const userId = headers.userIdHeader;
    return this.todoService.createTodo(userId, input);
  }

  @Delete(':id')
  async delete(
    @RequestHeader(HeaderDTO) headers: any,
    @Param('id') id,
  ): Promise<any> {
    const userId = headers.userIdHeader;
    return this.todoService.deleteTodoById(userId, id);
  }

  @Post(':id/done')
  async markAsDone(
    @RequestHeader(HeaderDTO) headers: any,
    @Param('id') id,
  ): Promise<any> {
    const userId = headers.userIdHeader;
    return this.todoService.markTodoAsDone(userId, id);
  }

  @Post(':id/setpriority')
  async setPriority(
    @RequestHeader(HeaderDTO) headers: any,
    @Param('id') id,
    @Body() input: SetPriorityInputDTO,
  ): Promise<any> {
    const userId = headers.userIdHeader;
    return this.todoService.setPriority(userId, id, input.priority);
  }

  @Post(':id/setduedate')
  async setDueDate(
    @RequestHeader(HeaderDTO) headers: any,
    @Param('id') id,
    @Body() input: SetDueDateInputDTO,
  ): Promise<any> {
    const userId = headers.userIdHeader;
    return this.todoService.setDueDate(userId, id, input.date);
  }

  @Post(':id/setstatus')
  async setStatus(
    @RequestHeader(HeaderDTO) headers: any,
    @Param('id') id,
    @Body() input: SetStatusInputDTO,
  ): Promise<any> {
    const userId = headers.userIdHeader;
    return this.todoService.setStatus(userId, id, input.status);
  }

  @Post(':id/setprivate')
  async setPrivate(
    @RequestHeader(HeaderDTO) headers: any,
    @Param('id') id,
    @Body() input: SetPrivateInputDTO,
  ): Promise<any> {
    const userId = headers.userIdHeader;
    return this.todoService.setPrivate(userId, id, input.private);
  }
}
