import { Body, Controller, Post, Req, UseGuards, Get } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserEntity } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';

interface AuthenticatedRequest extends Request {
  user: UserEntity;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  @Public()
  signin(@Req() req: AuthenticatedRequest) {
    return this.authService.signin(req.user);
  }

  @Post('signup')
  @Public()
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Get('me')
  getMe(@CurrentUser() user: UserEntity) {
    return user;
  }
}
