import { Body, Controller, UseGuards, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRolesGuard } from 'src/users/guards/user-roles.guard';
import { UserRoles } from 'src/users/decorators/user-roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
@UseGuards(UserRolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UserRoles('USER')
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
