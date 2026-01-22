import { UserEntity } from '../entities/user.entity';
import { UserRole } from '../entities/user-role.enum';
import { User as PrismaUser } from 'prisma/generated/client';

export class UserMapper {
  static toEntity(user: PrismaUser): UserEntity {
    return new UserEntity({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      role: UserMapper.mapRole(user.role),
    });
  }

  private static mapRole(role: PrismaUser['role']): UserRole {
    switch (role) {
      case 'ADMIN':
        return UserRole.ADMIN;
      case 'USER':
        return UserRole.USER;
      default:
        throw new Error(`Unhandled role: ${role}`);
    }
  }
}
