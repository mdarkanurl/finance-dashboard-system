import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/authorization/decorators/roles.decorator';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { DashboardService } from './dashboard.service';
import {
  getDashboardSummaryQuerySchema,
  type GetDashboardSummaryQueryDto,
} from './dto/get-dashboard-summary-query.dto';
import {
  getDashboardTrendsQuerySchema,
  type GetDashboardTrendsQueryDto,
} from './dto/get-dashboard-trends-query.dto';
import {
  getDashboardRecentQuerySchema,
  type GetDashboardRecentQueryDto,
} from './dto/get-dashboard-recent-query.dto';

@Controller({ path: 'dashboard', version: '1' })
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles(Role.viewer, Role.analyst, Role.admin)
  @Get('/recent')
  @HttpCode(HttpStatus.OK)
  async getRecent(
    @Query(new ZodValidationPipe(getDashboardRecentQuerySchema))
    query: GetDashboardRecentQueryDto,
  ) {
    try {
      const recentTransactions = await this.dashboardService.getRecent(query);

      return {
        success: true,
        message: 'dashboard recent transactions fetched successfully',
        data: recentTransactions,
        error: null,
      };
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException('Failed to fetch dashboard recent transactions');
    }
  }

  @Roles(Role.viewer, Role.analyst, Role.admin)
  @Get('/trends')
  @HttpCode(HttpStatus.OK)
  async getTrends(
    @Query(new ZodValidationPipe(getDashboardTrendsQuerySchema))
    query: GetDashboardTrendsQueryDto,
  ) {
    try {
      const trends = await this.dashboardService.getTrends(query);

      return {
        success: true,
        message: 'dashboard trends fetched successfully',
        data: trends,
        error: null,
      };
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException('Failed to fetch dashboard trends');
    }
  }

  @Roles(Role.viewer, Role.analyst, Role.admin)
  @Get('/categories')
  @HttpCode(HttpStatus.OK)
  async getCategories() {
    try {
      const categories = await this.dashboardService.getCategories();

      return {
        success: true,
        message: 'dashboard categories fetched successfully',
        data: categories,
        error: null,
      };
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException('Failed to fetch dashboard categories');
    }
  }

  @Roles(Role.viewer, Role.analyst, Role.admin)
  @Get('/summary')
  @HttpCode(HttpStatus.OK)
  async getSummary(
    @Query(new ZodValidationPipe(getDashboardSummaryQuerySchema))
    query: GetDashboardSummaryQueryDto,
  ) {
    try {
      const summary = await this.dashboardService.getSummary(query);

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
