import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { TeamRole } from 'prisma/generated/enums';
import { AddTeamMemberDto } from './dto/add-team-member.dto';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, teamName: string) {
    return this.prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: {
          name: teamName,
          ownerId: userId,
        },
      });

      await tx.teamMember.create({
        data: {
          teamId: team.id,
          memberId: userId,
          role: TeamRole.OWNER,
        },
      });

      return team;
    });
  }

  async update(teamId: string, teamName: string) {
    return await this.prisma.team.update({
      where: {
        id: teamId,
      },
      data: {
        name: teamName,
      },
    });
  }

  async delete(teamId: string) {
    return await this.prisma.team.delete({
      where: {
        id: teamId,
      },
    });
  }

  async findByUserId(userId: string) {
    const teams = await this.prisma.team.findMany({
      where: {
        ownerId: userId,
      },
    });

    return teams;
  }

  async getTeamRole(memberId: string, teamId: string) {
    const user = await this.prisma.teamMember.findFirst({
      where: {
        memberId,
        teamId,
      },
    });

    return user;
  }

  async addMember(teamId: string, dto: AddTeamMemberDto) {
    return await this.prisma.teamMember.create({
      data: {
        teamId,
        memberId: dto.memberId,
        role: dto.role,
      },
    });
  }
}
