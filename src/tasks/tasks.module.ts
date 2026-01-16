import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaModule } from 'src/database/prisma.module';
import { TasksController } from './tasks.controller';
import { TeamsModule } from 'src/teams/teams.module';

@Module({
  imports: [PrismaModule, TeamsModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
