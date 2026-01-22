import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUser(userId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: {
        recipientId: userId,
      },
    });
    return notifications;
  }

  async read(id: string) {
    const notification = await this.prisma.notification.update({
      where: {
        id,
      },
      data: {
        readAt: new Date(),
      },
    });

    return notification;
  }

  async readAll(userId: string) {
    const notifications = await this.prisma.notification.updateMany({
      where: {
        recipientId: userId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    return notifications;
  }

  async delete(id: string) {
    const notification = await this.prisma.notification.delete({
      where: {
        id,
      },
    });

    return notification;
  }

  async deleteAll(userId: string) {
    const notifications = await this.prisma.notification.deleteMany({
      where: {
        recipientId: userId,
      },
    });

    return notifications;
  }
}
