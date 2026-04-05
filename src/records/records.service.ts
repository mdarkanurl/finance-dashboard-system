import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecordDto } from './dto/create-record.dto';

@Injectable()
export class RecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    data: CreateRecordDto
  ) {
    return this.prisma.record.create({
      data: {
        ...data,
        createdBy: userId
      }
    });
  }
}
