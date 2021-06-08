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
import { Priority, Status, Todo } from './models/todo.entity';
import { TodoService } from './todo.service';
import { SetPriorityInputDTO } from './dto/setPriorityInput.dto';
import { SetDueDateInputDTO } from './dto/setDueDateInput.dto';
import { SetStatusInputDTO } from './dto/setStatusInput.dto';

@Controller('todos')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  async getTodos(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('status') status: Status,
    @Query('priority') priority: Priority,
  ) {
    limit = limit > 100 ? 100 : limit; //hard-limit TO-DO: configure via env variable?
    return this.todoService.paginate(
      {
        page,
        limit,
      },
      status,
      priority,
    );
  }

  @Get(':id')
  async getTodo(@Param('id') id): Promise<any> {
    return this.todoService.getTodo(id);
  }

  @Post()
  async createTodo(@Body() todoData: Todo): Promise<any> {
    return this.todoService.createTodo(todoData);
  }

  @Delete(':id')
  async delete(@Param('id') id): Promise<any> {
    return this.todoService.deleteTodoById(id);
  }

  @Post(':id/done')
  async markAsDone(@Param('id') id): Promise<any> {
    return this.todoService.markTodoAsDone(id);
  }

  @Post(':id/setpriority')
  async setPriority(
    @Param('id') id,
    @Body() input: SetPriorityInputDTO,
  ): Promise<any> {
    return this.todoService.setPriority(id, input.priority);
  }

  @Post(':id/setduedate')
  async setDueDate(
    @Param('id') id,
    @Body() input: SetDueDateInputDTO,
  ): Promise<any> {
    return this.todoService.setDueDate(id, input.date);
  }

  @Post(':id/setstatus')
  async setStatus(
    @Param('id') id,
    @Body() input: SetStatusInputDTO,
  ): Promise<any> {
    return this.todoService.setStatus(id, input.status);
  }
}
