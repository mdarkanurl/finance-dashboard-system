import { Injectable } from '@nestjs/common';
import { RecordType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

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
}
