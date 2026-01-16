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
import { TeamsService } from './teams.service';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamRoles } from 'src/teams/decorators/team-roles.decorator';
import { TeamRolesGuard } from 'src/teams/guards/team-roles.guard';
import { AddTeamMemberDto } from './dto/add-team-member.dto';

@Controller('teams')
@UseGuards(TeamRolesGuard)
export class TeamsController {
  constructor(private readonly teamsSerivce: TeamsService) {}

  @Post()
  createTeam(@CurrentUser() user: UserEntity, @Body() dto: CreateTeamDto) {
    return this.teamsSerivce.create(user.id, dto.teamName);
  }

  @Get()
  findByUser(@CurrentUser() user: UserEntity) {
    return this.teamsSerivce.findByUserId(user.id);
  }

  @Patch(':id')
  @TeamRoles('OWNER')
  updateTeamName(@Param('id') teamId: string, @Body() dto: UpdateTeamDto) {
    return this.teamsSerivce.update(teamId, dto.teamName);
  }

  @Delete(':id')
  @TeamRoles('OWNER')
  deleteTeam(@Param('id') teamId: string) {
    return this.teamsSerivce.delete(teamId);
  }

  @Post(':id/members')
  @TeamRoles('OWNER')
  addMember(@Param('id') teamId: string, @Body() dto: AddTeamMemberDto) {
    return this.teamsSerivce.addMember(teamId, dto);
  }
}
