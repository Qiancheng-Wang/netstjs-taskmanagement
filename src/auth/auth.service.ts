import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './auth.entity';
import { UserRepository } from './auth.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('Test');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  @Cron('0 0 0 * * *')
  /**
   * Reset failed attempts for password failure.
   */
  async handleReset(): Promise<void> {
    this.logger.debug('reset failed attemp time.');
    return this.userRepository.resetAttemptTimes();
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validatePassword(
      authCredentialsDto,
    );

    if (!username) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const accessToken = await this.jwtService.sign({
      username,
    });

    return { accessToken };
  }

  async resetPassword(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.userRepository.resetPassword(authCredentialsDto);
  }
}
