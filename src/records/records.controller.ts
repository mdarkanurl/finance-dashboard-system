import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/authorization/decorators/roles.decorator';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  createRecordSchema,
  type CreateRecordDto,
} from './dto/create-record.dto';
import {
  getRecordsQuerySchema,
  type GetRecordsQueryDto,
} from './dto/get-records-query.dto';
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

  @Roles(Role.viewer, Role.analyst, Role.admin)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query(new ZodValidationPipe(getRecordsQuerySchema))
    query: GetRecordsQueryDto
  ) {
    try {
      const result = await this.recordsService.findAll(query);

      return {
        success: true,
        message: 'records fetched successfully',
        data: result,
        error: null,
      };
    } catch (error) {
      console.log(error);
      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException('Failed to fetch records');
    }
  }

  @Roles(Role.viewer, Role.analyst, Role.admin)
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id') id: string
  ) {
    try {
      const record = await this.recordsService.findOne(id);

      return {
        success: true,
        message: 'record fetched successfully',
        data: record,
        error: null,
      };
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException('Failed to fetch record');
    }
  }
}
