import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './auth.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private async hashPassword(password: string, salt: string) {
    return bcrypt.hash(password, salt);
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;

    const user = new User();
    const salt = await bcrypt.genSalt();
    user.username = username;
    user.password = await this.hashPassword(password, salt);
    user.validate_password_times = 3;

    try {
      return await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`Username ${username} already exists.`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validatePassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;

    const user = await this.findOne({
      username,
    });

    if (!user) {
      return null;
    }

    if (user.validate_password_times === 0) {
      throw new UnauthorizedException(
        'Too many failed attempted, please reset your password.',
      );
    }
    const result = await user.validatePassword(password);

    if (result) {
      return user.username;
    } else {
      user.validate_password_times -= 1;
      await user.save();
      return null;
    }
  }

  async resetAttemptTimes(): Promise<void> {
    try {
      await this.createQueryBuilder()
        .update(User)
        .set({
          validate_password_times: 3,
        })
        .where('validate_password_times != 3')
        .execute();
    } catch (err) {
      throw new InternalServerErrorException('Batch update error.');
    }
  }

  async resetPassword(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password: newPassword } = authCredentialsDto;

    const user = await this.findOne({
      username,
    });

    if (!user) {
      throw new NotFoundException(`Username ${username} not found!`);
    }

    const result = await user.validatePassword(newPassword);

    if (result) {
      throw new ConflictException(
        'Password is the same as one of your previous one, please try another one.',
      );
    } else {
      const salt = await bcrypt.genSalt();
      user.password = await this.hashPassword(newPassword, salt);
      user.validate_password_times = 3;
      return await user.save();
    }
  }
}
