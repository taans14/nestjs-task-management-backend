import { Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('notifications')
export class NotifactionsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findByUser(@CurrentUser() user: UserEntity) {
    return this.notificationsService.findByUser(user.id);
  }

  @Patch()
  readAllNotifications(@CurrentUser() user: UserEntity) {
    return this.notificationsService.readAll(user.id);
  }

  @Patch(':id')
  readNotification(@Param('id') notificationId: string) {
    return this.notificationsService.read(notificationId);
  }

  @Delete()
  deleteAllNotifications(@CurrentUser() user: UserEntity) {
    return this.notificationsService.deleteAll(user.id);
  }

  @Delete(':id')
  deleteNotification(@Param('id') notificationId: string) {
    return this.notificationsService.delete(notificationId);
  }
}
