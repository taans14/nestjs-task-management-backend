import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'prisma/generated/client';

export class UserEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @Exclude()
  passwordHash: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date | null;

  @ApiProperty()
  role: UserRole;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
