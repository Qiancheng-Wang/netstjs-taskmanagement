import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GetTaskFilterDto } from '../dto/get-tasks-filter.dto';
import { TaskStatus } from '../task-status.enum';
import { TasksRepository } from '../tasks.repository';
import { TasksService } from '../tasks.service';

const mockUser = {
  id: 12,
  username: 'test1',
};

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
});

describe('TaskService', () => {
  let taskService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useFactory: mockTaskRepository,
        },
      ],
    }).compile();

    taskService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TasksRepository>(TasksRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('somevalue');

      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const filters: GetTaskFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'some search query',
      };

      const result = await taskService.getTasks(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('somevalue');
    });
  });

  describe('getTaskById', () => {
    it('Success - get Task By Id', async () => {
      const mockTask = {
        title: 'mock title',
        description: 'mock description',
      };
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await taskService.getByTaskId(1, mockUser);
      expect(result).toEqual(mockTask);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id,
        },
      });
    });

    it('Failed - get Task By Id', async () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(taskService.getByTaskId(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('Success - create task', async () => {
      taskRepository.createTask.mockResolvedValue('some task');
      expect(taskRepository.createTask).not.toHaveBeenCalled();
      const createTaskDto = {
        title: 'mock title',
        description: 'mock description',
      };
      const result = await taskRepository.createTask(createTaskDto, mockUser);
      expect(taskRepository.createTask).toHaveBeenCalledWith(
        createTaskDto,
        mockUser,
      );

      expect(result).toEqual('some task');
    });
  });
});
