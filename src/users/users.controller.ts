import {
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
  Query,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/authorization/decorators/roles.decorator';
import { getUsersQuerySchema, type GetUsersQueryDto } from './dto/get-users-query.dto';
import { UsersService } from './users.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.admin)
  @Get()
  async findAll(
    @Query(new ZodValidationPipe(getUsersQuerySchema))
    query: GetUsersQueryDto
  ) {
    try {
      const result = await this.usersService.findAll(query);

      return {
        success: true,
        message: 'users fetched successfully',
        data: result,
        error: null,
      };
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException('Failed to fetch users');
    }
  }

  @Roles(Role.admin)
  @Get('/:id')
  async findOne(
    @Param('id') id: string
  ) {
    try {
      const user = await this.usersService.findOne(id);

      return {
        success: true,
        message: 'user fetched successfully',
        data: user,
        error: null,
      };
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException('Failed to fetch user');
    }
  }
}
