import { Body, Controller, Post, Req, UseGuards, Get } from '@nestjs/common';

import { SigninDto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: UserEntity;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  signin(@Req() req: AuthenticatedRequest) {
    return this.authService.signin(req.user);
  }

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}
