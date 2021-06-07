import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Todo } from './models/todo.entity';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  async getTodos() {
    return this.todoService.getTodos();
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
}
