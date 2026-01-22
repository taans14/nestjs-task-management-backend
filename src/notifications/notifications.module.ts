import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotifactionsController } from './notifications.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NotifactionsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
