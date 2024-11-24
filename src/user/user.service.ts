import { ForbiddenException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { User } from '@prisma/client';
import { UserDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async update(id: number, dto: UserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    const data = {
      email: dto.email,
      username: dto.username,
      hash: '',
    };

    if (user.email === dto.email) {
      delete data.email;
    }

    if (!!dto.old_password || !!dto.new_password || !!dto.confirm_password) {
      if (!dto.new_password || dto.new_password !== dto.confirm_password)
        throw new UnprocessableEntityException('Passwords do not match!');

      const matchesPassword = await argon.verify(user.hash, dto.old_password);

      if (!matchesPassword)
        throw new UnprocessableEntityException('Invalid password!');

      data.hash = await argon.hash(dto.new_password);
    } else {
      delete data.hash;
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: user.id },
        data,
      });
      delete updatedUser.hash;
      return updatedUser;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists!');
        }
      }
      throw error;
    }
  }
}
