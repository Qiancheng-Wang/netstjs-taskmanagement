import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from './auth.entity';
import { UserRepository } from './auth.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'topSecret51',
    });
  }

  async validate(payload: { username: string }): Promise<User> {
    const { username } = payload;

    const user = this.userRepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Unauthorized Exception');
    }

    return user;
  }
}
