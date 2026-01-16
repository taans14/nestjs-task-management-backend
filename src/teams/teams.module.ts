import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { TeamRolesGuard } from './guards/team-roles.guard';

@Module({
  imports: [PrismaModule],
  controllers: [TeamsController],
  providers: [TeamsService, TeamRolesGuard],
  exports: [TeamsService, TeamRolesGuard],
})
export class TeamsModule {}
