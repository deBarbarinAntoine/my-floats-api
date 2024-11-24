import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, RegisterDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // generate the password hash
    const hash = await argon.hash(dto.password);

    // save the new user in the database
    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          hash,
        },
      });

      // return the saved user (without sensitive information)
      return {
        message: 'register',
        user: {
          id: user.id,
          createdAt: user.createdAt,
          username: user.username,
          email: user.email,
        },
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials already exist!');
        }
      }
      throw error;
    }
  }
  async login(dto: AuthDto) {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // if not exists, throw exception
    if (!user) throw new ForbiddenException('Invalid credentials!');

    // check password
    const matchPassword = await argon.verify(user.hash, dto.password);

    // if password incorrect, throw exception
    if (!matchPassword) throw new ForbiddenException('Invalid credentials!');

    // generate JWT
    const jwt = await this.signToken(user.id, user.email);
    // return user
    return {
      message: 'login',
      data: jwt,
    };
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }
}
