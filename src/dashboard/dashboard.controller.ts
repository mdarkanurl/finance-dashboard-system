import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/authorization/decorators/roles.decorator';
import { DashboardService } from './dashboard.service';

@Controller({ path: 'dashboard', version: '1' })
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles(Role.viewer, Role.analyst, Role.admin)
  @Get('/summary')
  @HttpCode(HttpStatus.OK)
  async getSummary() {
    try {
      const summary = await this.dashboardService.getSummary();

      return {
        success: true,
        message: 'dashboard summary fetched successfully',
        data: summary,
        error: null,
      };
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException('Failed to fetch dashboard summary');
    }
  }
}
