import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function getPeriodRange(period: string): { start: Date; end: Date; label: string } {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  if (period === 'daily') {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return { start, end, label: `${start.toLocaleDateString('uz-UZ')}` };
  }

  if (period === 'weekly') {
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return {
      start,
      end,
      label: `${start.toLocaleDateString('uz-UZ')} — ${end.toLocaleDateString('uz-UZ')}`,
    };
  }

  // monthly
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    start,
    end,
    label: `${start.toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })}`,
  };
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const canView = session.user.role === 'ADMIN' || session.user.role === 'BOSHLIQ';
  if (!canView) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const period = req.nextUrl.searchParams.get('period') || 'daily';
  const { start, end, label } = getPeriodRange(period);

  // Mahsulotlar va tranzaksiyalar
  const products = await prisma.product.findMany({
    include: {
      transactions: {
        where: { createdAt: { gte: start, lte: end } },
      },
    },
  });

  const productStats = products.map((p) => {
    const income = p.transactions.filter((t) => t.type === 'KIRIM').reduce((s, t) => s + t.quantity, 0);
    const expense = p.transactions.filter((t) => t.type === 'CHIQIM').reduce((s, t) => s + t.quantity, 0);
    const balance = income - expense;
    const profit = expense * (Number(p.sellPrice) - Number(p.buyPrice));
    return { id: p.id, name: p.name, income, expense, balance, profit };
  });

  const totalIncome = productStats.reduce((s, p) => s + p.income, 0);
  const totalExpense = productStats.reduce((s, p) => s + p.expense, 0);
  const totalProfit = productStats.reduce((s, p) => s + p.profit, 0);

  // Xodimlar statistikasi
  const users = await prisma.user.findMany({
    where: { role: { in: ['SOTUVCHI', 'OMBORCHI', 'BOSHLIQ'] } },
    include: {
      attendances: {
        where: { date: { gte: start, lte: end } },
      },
      transactions: {
        where: { createdAt: { gte: start, lte: end } },
      },
    },
  });

  const employeeStats = users.map((u) => {
    const workHours = u.attendances.reduce((sum, att) => {
      if (!att.leftAt) return sum;
      return sum + (new Date(att.leftAt).getTime() - new Date(att.arrivedAt).getTime()) / 3600000;
    }, 0);
    return {
      id: u.id,
      fullName: u.fullName,
      workHours,
      transactions: u.transactions.length,
    };
  });

  return NextResponse.json({
    period: label,
    products: productStats,
    totalIncome,
    totalExpense,
    totalProfit,
    employees: employeeStats,
  });
}
