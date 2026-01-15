import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TeamsService } from './teams.service';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private readonly teamsSerivce: TeamsService) {}

  @Post()
  createTeam(@CurrentUser() user: UserEntity, @Body() teamName: string) {
    return this.teamsSerivce.create(user.id, teamName);
  }

  @Get()
  findByUser(@CurrentUser() user: UserEntity) {
    return this.teamsSerivce.findByUserId(user.id);
  }

  @Patch(':id')
  updateTeamName(@Param('id') teamId: string, @Body('name') teamName: string) {
    return this.teamsSerivce.update(teamId, teamName);
  }

  @Delete(':id')
  deleteTeam(@Param('id') teamId: string) {
    return this.teamsSerivce.delete(teamId);
  }
}
