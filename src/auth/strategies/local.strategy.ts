import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { SigninDto } from '../dto/signin.dto';
import { validateOrReject } from 'class-validator';
import { UserMapper } from 'src/users/mappers/user.mapper';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    const dto = plainToInstance(SigninDto, { email, password });

    await validateOrReject(dto);

    const user = await this.authService.validateUser(dto);

    if (!user) throw new UnauthorizedException();

    return UserMapper.toEntity(user);
  }
}
