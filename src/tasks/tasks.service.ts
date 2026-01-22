import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { RequestContext as Ctx } from 'src/common/context/request.context';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ctx: Ctx,
  ) {}

  async create(dto: CreateTaskDto) {
    const creatorId = this.ctx.userId;
    const teamId = this.ctx.teamId;

    if (!creatorId) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (!teamId) {
      throw new ForbiddenException('No team context');
    }

    return this.prisma.$transaction(async (tx) => {
      const task = await tx.task.create({
        data: {
          title: dto.title,
          content: dto.content,
          creatorId,
          teamId,
        },
      });

      const team = await tx.team.findUnique({
        where: { id: teamId },
        select: { name: true },
      });

      const teamMembers = await tx.teamMember.findMany({
        where: {
          teamId,
        },
      });

      await tx.notification.createMany({
        data: teamMembers.map((teamMembers) => ({
          recipientId: teamMembers.memberId,
          message: `A new task has been added to Team ${team?.name}`,
        })),
      });

      return task;
    });
  }

  async findByTeamId() {
    const teamId = this.ctx.teamId;

    if (!teamId) throw new ForbiddenException('No team context');

    const tasks = await this.prisma.task.findMany({
      where: {
        teamId,
      },
    });
    return tasks;
  }
}
