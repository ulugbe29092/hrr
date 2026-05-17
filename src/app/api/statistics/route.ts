import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || 'daily';

  const now = new Date();
  let startDate = new Date();
  let prevStartDate = new Date();
  let prevEndDate = new Date();

  // Calculate date ranges
  switch (period) {
    case 'daily':
      startDate.setHours(0, 0, 0, 0);
      prevStartDate.setDate(now.getDate() - 1);
      prevStartDate.setHours(0, 0, 0, 0);
      prevEndDate.setDate(now.getDate() - 1);
      prevEndDate.setHours(23, 59, 59, 999);
      break;
    case 'weekly':
      startDate.setDate(now.getDate() - 7);
      prevStartDate.setDate(now.getDate() - 14);
      prevEndDate.setDate(now.getDate() - 7);
      break;
    case 'monthly':
      startDate.setMonth(now.getMonth() - 1);
      prevStartDate.setMonth(now.getMonth() - 2);
      prevEndDate.setMonth(now.getMonth() - 1);
      break;
    case 'yearly':
      startDate.setFullYear(now.getFullYear() - 1);
      prevStartDate.setFullYear(now.getFullYear() - 2);
      prevEndDate.setFullYear(now.getFullYear() - 1);
      break;
  }

  // Fetch current period transactions
  const transactions = await prisma.transaction.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: now,
      },
    },
    include: {
      product: true,
    },
  });

  // Fetch previous period transactions for comparison
  const prevTransactions = await prisma.transaction.findMany({
    where: {
      createdAt: {
        gte: prevStartDate,
        lte: prevEndDate,
      },
    },
  });

  // Calculate stats
  const totalIncome = transactions.filter((t) => t.type === 'KIRIM').reduce((s, t) => s + t.quantity, 0);
  const totalExpense = transactions.filter((t) => t.type === 'CHIQIM').reduce((s, t) => s + t.quantity, 0);
  const totalSales = totalExpense;
  const totalProfit = transactions
    .filter((t) => t.type === 'CHIQIM')
    .reduce((s, t) => s + t.quantity * (Number(t.product.sellPrice) - Number(t.product.buyPrice)), 0);

  // Previous period stats
  const prevTotalSales = prevTransactions.filter((t) => t.type === 'CHIQIM').reduce((s, t) => s + t.quantity, 0);
  const percentChange = prevTotalSales === 0 ? 100 : ((totalSales - prevTotalSales) / prevTotalSales) * 100;

  // Top products
  const productSales: Record<string, { name: string; quantity: number; profit: number }> = {};
  transactions
    .filter((t) => t.type === 'CHIQIM')
    .forEach((t) => {
      if (!productSales[t.product.name]) {
        productSales[t.product.name] = { name: t.product.name, quantity: 0, profit: 0 };
      }
      productSales[t.product.name].quantity += t.quantity;
      productSales[t.product.name].profit += t.quantity * (Number(t.product.sellPrice) - Number(t.product.buyPrice));
    });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  // Sales by hour (daily only)
  let salesByHour: Array<{ hour: number; count: number }> | undefined;
  if (period === 'daily') {
    salesByHour = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));
    transactions
      .filter((t) => t.type === 'CHIQIM')
      .forEach((t) => {
        const hour = new Date(t.createdAt).getHours();
        salesByHour![hour].count += t.quantity;
      });
  }

  return NextResponse.json({
    period,
    totalSales,
    totalIncome,
    totalExpense,
    totalProfit,
    topProducts,
    salesByHour,
    comparison: {
      percentChange,
      isIncrease: percentChange >= 0,
    },
  });
}
