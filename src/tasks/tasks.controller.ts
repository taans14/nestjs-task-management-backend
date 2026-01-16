import { Controller, Post, Get, UseGuards, Param, Body } from '@nestjs/common';
import { TeamRolesGuard } from 'src/teams/guards/team-roles.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { TasksService } from './tasks.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TeamRoles } from 'src/teams/decorators/team-roles.decorator';

@Controller()
@UseGuards(TeamRolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('teams/:id/tasks')
  @TeamRoles('MEMBER', 'OWNER')
  async createTask(
    @CurrentUser() user: UserEntity,
    @Param('id') teamId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.create(user.id, teamId, dto);
  }

  @Get('teams/:id/tasks')
  @TeamRoles('MEMBER', 'OWNER')
  async findTasksByTeamId(@Param('id') teamId: string) {
    return this.tasksService.findByTeamId(teamId);
  }
}
