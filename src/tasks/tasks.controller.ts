import { Controller, Post, Get, UseGuards, Body } from '@nestjs/common';
import { TeamRolesGuard } from 'src/teams/guards/team-roles.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TeamRoles } from 'src/teams/decorators/team-roles.decorator';

@Controller()
@UseGuards(TeamRolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('teams/:id/tasks')
  @TeamRoles('MEMBER', 'OWNER')
  async createTask(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Get('teams/:id/tasks')
  @TeamRoles('MEMBER', 'OWNER')
  async findTasksByTeamId() {
    return this.tasksService.findByTeamId();
  }
}
