import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/authorization/decorators/roles.decorator';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  createUserByAdminSchema,
  type CreateUserByAdminDto,
} from './dto/create-user-by-admin.dto';
import { getUsersQuerySchema, type GetUsersQueryDto } from './dto/get-users-query.dto';
import {
  updateUserByAdminSchema,
  type UpdateUserByAdminDto,
} from './dto/update-user-by-admin.dto';
import { UsersService } from './users.service';
import { RateLimit } from 'src/rate-limit/rate-limit.decorator';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @RateLimit({ points: 15, duration: 60 })
  @Roles(Role.admin)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(createUserByAdminSchema))
    body: CreateUserByAdminDto
  ) {
    try {
      const user = await this.usersService.createByAdmin(body);

      return {
        success: true,
        message: 'user created successfully',
        data: user,
        error: null,
      };
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException('Failed to create user');
    }
  }

  @RateLimit({ points: 15, duration: 60 })
  @Roles(Role.admin)
  @HttpCode(HttpStatus.OK)
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

  @RateLimit({ points: 15, duration: 60 })
  @Roles(Role.admin)
  @HttpCode(HttpStatus.OK)
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

  @RateLimit({ points: 15, duration: 60 })
  @Roles(Role.admin)
  @HttpCode(HttpStatus.OK)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateUserByAdminSchema))
    body: UpdateUserByAdminDto
  ) {
    try {
      const user = await this.usersService.updateByAdmin(id, body);

      return {
        success: true,
        message: 'user updated successfully',
        data: user,
        error: null,
      };
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException('Failed to update user');
    }
  }

  @RateLimit({ points: 15, duration: 60 })
  @Roles(Role.admin)
  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  async remove(
    @Param('id') id: string
  ) {
    try {
      const user = await this.usersService.deleteByAdmin(id);

      return {
        success: true,
        message: 'user deactivated successfully',
        data: user,
        error: null,
      };
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException('Failed to delete user');
    }
  }
}
