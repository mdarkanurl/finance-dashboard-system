import { Injectable } from '@nestjs/common';
import { RecordType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetDashboardRecentQueryDto } from './dto/get-dashboard-recent-query.dto';
import { GetDashboardTrendsQueryDto } from './dto/get-dashboard-trends-query.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getRecent(
    query: GetDashboardRecentQueryDto,
  ) {
    const { limit } = query;

    return this.prisma.record.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        date: 'desc',
      },
      take: limit,
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
    });
  }

  async getTrends(
    query: GetDashboardTrendsQueryDto,
  ) {
    const records = await this.prisma.record.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        date: 'asc',
      },
      select: {
        amount: true,
        type: true,
        date: true,
      },
    });

    const trendsMap = new Map<string, { date: string; income: number; expense: number }>();

    for (const record of records) {
      const key =
        query.range === 'monthly'
          ? this.formatMonth(record.date)
          : this.getWeekStartDate(record.date);

      const current = trendsMap.get(key) ?? {
        date: key,
        income: 0,
        expense: 0,
      };

      if (record.type === RecordType.income) {
        current.income += record.amount;
      }

      if (record.type === RecordType.expense) {
        current.expense += record.amount;
      }

      trendsMap.set(key, current);
    }

    return Array.from(trendsMap.values());
  }

  async getCategories() {
    const where = {
      deletedAt: null,
    };

    const [categories, totalAmountSummary] = await this.prisma.$transaction([
      this.prisma.record.groupBy({
        by: ['category'],
        where,
        _sum: {
          amount: true,
        },
        orderBy: {
          _sum: {
            amount: 'desc',
          },
        },
      }),
      this.prisma.record.aggregate({
        where,
        _sum: {
          amount: true,
        },
      }),
    ]);

    const totalAmount = totalAmountSummary._sum.amount ?? 0;

    return categories.map((item) => {
      const categoryTotalAmount = item._sum?.amount ?? 0;

      return {
        category: item.category,
        totalAmount: categoryTotalAmount,
        percentage:
          totalAmount === 0 ? 0 : Number(((categoryTotalAmount / totalAmount) * 100).toFixed(2)),
      };
    });
  }

  async getSummary() {
    const where = {
      deletedAt: null,
    };

    const [incomeSummary, expenseSummary, totalTransactions] =
      await this.prisma.$transaction([
        this.prisma.record.aggregate({
          where: {
            ...where,
            type: RecordType.income,
          },
          _sum: {
            amount: true,
          },
        }),
        this.prisma.record.aggregate({
          where: {
            ...where,
            type: RecordType.expense,
          },
          _sum: {
            amount: true,
          },
        }),
        this.prisma.record.count({ where }),
      ]);

    const totalIncome = incomeSummary._sum.amount ?? 0;
    const totalExpense = expenseSummary._sum.amount ?? 0;

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      totalTransactions,
    };
  }

  private formatMonth(date: Date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');

    return `${year}-${month}`;
  }

  private getWeekStartDate(date: Date) {
    const utcDate = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );

    const day = utcDate.getUTCDay();
    const diff = day === 0 ? -6 : 1 - day;

    utcDate.setUTCDate(utcDate.getUTCDate() + diff);

    return utcDate.toISOString().split('T')[0];
  }
}
