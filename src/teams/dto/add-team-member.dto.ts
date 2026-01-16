import { IsUUID, IsEnum } from 'class-validator';
import { TeamRole } from 'prisma/generated/client';

export class AddTeamMemberDto {
  @IsUUID()
  memberId: string;

  @IsEnum(TeamRole)
  role: TeamRole;
}
