import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(creatorId: string, teamId: string, dto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        content: dto.content,
        creatorId,
        teamId: teamId,
      },
    });
    return task;
  }

  async findByTeamId(teamId: string) {
    const tasks = await this.prisma.task.findMany({
      where: {
        teamId,
      },
    });
    return tasks;
  }
}
