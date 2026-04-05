import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/authorization/decorators/roles.decorator';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  createRecordSchema,
  type CreateRecordDto,
} from './dto/create-record.dto';
import { RecordsService } from './records.service';
import { type Request } from 'express';

@Controller({ path: 'records', version: '1' })
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Roles(Role.admin)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(createRecordSchema))
    body: CreateRecordDto,
    @Req() req: Request
  ) {
    try {
      const userId = req.user?.userId as string;
      const record = await this.recordsService.create(userId, body);

      return {
        success: true,
        message: 'record created successfully',
        data: record,
        error: null,
      };
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException('Failed to create record');
    }
  }
}
