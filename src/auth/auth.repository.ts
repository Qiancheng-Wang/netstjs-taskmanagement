import {
  ConflictException,
  InternalServerErrorException,
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

    const result = await user.validatePassword(password);

    if (user && result) {
      return user.username;
    } else {
      return null;
    }
  }
}
