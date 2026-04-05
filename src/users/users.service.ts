import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Status } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserByAdminDto } from './dto/create-user-by-admin.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UpdateUserByAdminDto } from './dto/update-user-by-admin.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createByAdmin(
    data: CreateUserByAdminDto
  ) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      return await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
        select: {
          id: true,
          fullname: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('user already exists');
      }

      throw error;
    }
  }

  async updateByAdmin(
    id: string,
    data: UpdateUserByAdminDto
  ) {
    try {
      return await this.prisma.user.update({
        where: {
          id,
          status: Status.active
        },
        data,
        select: {
          id: true,
          fullname: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('user not found');
        }
      }

      throw error;
    }
  }

  async deleteByAdmin(
    id: string
  ) {
    try {
      return await this.prisma.user.update({
        where: { 
          id,
          status: Status.active
         },
        data: {
          status: Status.inactive,
        },
        select: {
          id: true,
          fullname: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('user not found');
      }

      throw error;
    }
  }

  async findAll(
    query: GetUsersQueryDto
  ) {
    const { page, limit, search, role, status } = query;

    const where: any = {
      status: Status.active,
      ...(role && { role }),
      ...(status && { status }),
      ...(search && {
        OR: [
          {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            fullname: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      }),
    };

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          fullname: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        search: search ?? null,
        role: where.role ?? null,
        status: status ?? null,
      },
    };
  }

  async findOne(
    id: string
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        status: Status.active
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }
}
