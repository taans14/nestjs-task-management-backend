import { Body, Controller, UseGuards, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRolesGuard } from 'src/auth/guards/user-roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRoles } from 'src/auth/decorators/user-roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, UserRolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UserRoles('USER')
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
