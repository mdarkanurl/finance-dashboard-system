import { Injectable } from '@nestjs/common';
import { RecordType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

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
