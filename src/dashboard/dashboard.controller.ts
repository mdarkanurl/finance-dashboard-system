import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { DashboardService } from './dashboard.service';
import {
  getDashboardTopCategoriesQuerySchema,
  type GetDashboardTopCategoriesQueryDto,
} from './dto/get-dashboard-top-categories-query.dto';
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
import { RateLimit } from 'src/rate-limit/rate-limit.decorator';

@Controller({ path: 'dashboard', version: '1' })
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @RateLimit({ points: 15, duration: 60 })
  @Get('/top-categories') // return top spending categories
  @HttpCode(HttpStatus.OK)
  async getTopCategories(
    @Query(new ZodValidationPipe(getDashboardTopCategoriesQuerySchema))
    query: GetDashboardTopCategoriesQueryDto,
  ) {
    try {
      const topCategories = await this.dashboardService.getTopCategories(query);

      return {
        success: true,
        message: 'dashboard top categories fetched successfully',
        data: topCategories,
        error: null,
      };
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException('Failed to fetch dashboard top categories');
    }
  }

  @RateLimit({ points: 15, duration: 60 })
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

  @RateLimit({ points: 15, duration: 60 })
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

  @RateLimit({ points: 15, duration: 60 })
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

  @RateLimit({ points: 15, duration: 60 })
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
