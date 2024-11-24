import { Body, Controller, Delete, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';
import { UserDto } from './dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return {
      data: user,
    };
  }

  @Patch('update')
  async update(@GetUser() user: User, @Body() dto: UserDto) {
    const updatedUser = await this.userService.update(user.id, dto);
    return updatedUser;
  }

  @Delete('delete')
  async delete(@GetUser() user: User) {
    await this.prisma.user.delete({ where: { id: user.id } });
    return {
      data: {
        message: `User ${user.id} deleted successfully!`,
      },
    };
  }
}
