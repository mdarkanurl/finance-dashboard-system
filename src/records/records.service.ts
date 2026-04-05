import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { GetRecordsQueryDto } from './dto/get-records-query.dto';
import { UpdateRecordDto } from './dto/update-record.dto';

@Injectable()
export class RecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    data: CreateRecordDto
  ) {
    try {
      return this.prisma.record.create({
        data: {
          ...data,
          createdBy: userId
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    query: GetRecordsQueryDto
  ) {
    const { type, category, from, to, page, limit } = query;

    const where = {
      ...(type && { type }),
      ...(category && {
        category: {
          contains: category,
          mode: 'insensitive' as const,
        },
      }),
      ...((from || to) && {
        date: {
          ...(from && { gte: from }),
          ...(to && { lte: to }),
        },
      }),
    };

    const [records, total] = await this.prisma.$transaction([
      this.prisma.record.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          date: 'desc',
        },
        select: {
          id: true,
          createdBy: true,
          amount: true,
          type: true,
          category: true,
          date: true,
          note: true,
          updatedAt: true,
        },
      }),
      this.prisma.record.count({ where }),
    ]);

    return {
      records,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        type: type ?? null,
        category: category ?? null,
        from: from ?? null,
        to: to ?? null,
      },
    };
  }

  async findOne(
    id: string
  ) {
    try {
      const record = await this.prisma.record.findUnique({
        where: { id },
      });

      if (!record) {
        throw new NotFoundException('record not found');
      }

      return record;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    data: UpdateRecordDto
  ) {
    try {
      return await this.prisma.record.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('record not found');
      }

      throw error;
    }
  }
}
