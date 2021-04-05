import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/auth.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

// types
import { TaskStatus } from './task-status.enum';
import { Task } from './tasks.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private taskRepository: TasksRepository,
  ) {}

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getByTaskId(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task ID - ${id} Not Found!`);
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
    return this.taskRepository.creataTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({
      id,
      userId: user.id,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Task ID - ${id} Not Found!`);
    }
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getByTaskId(id, user);
    task.status = status;
    await task.save();
    return task;
  }
}
