import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dto/signup.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { UserMapper } from 'src/users/mappers/user.mapper';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(dto: SigninDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) return null;

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isMatch) return null;

    return UserMapper.toEntity(user);
  }

  async signup(dto: SignupDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      fullName: dto.fullName,
      email: dto.email,
      password: passwordHash,
    });

    return UserMapper.toEntity(user);
  }

  signin(user: UserEntity) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
