import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [
    totalEmployees,
    todayPresent,
    totalProducts,
    todayTransactions,
    allTransactions,
    recentNotifications,
    recentTransactions,
  ] = await Promise.all([
    prisma.user.count({ where: { role: { in: ['SOTUVCHI', 'OMBORCHI', 'BOSHLIQ'] } } }),
    prisma.attendance.count({ where: { date: { gte: today, lte: todayEnd } } }),
    prisma.product.count(),
    prisma.transaction.findMany({
      where: { createdAt: { gte: today, lte: todayEnd } },
      include: { product: true },
    }),
    prisma.transaction.findMany({ include: { product: true } }),
    prisma.notification.findMany({
      include: { creator: { select: { fullName: true } } },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.transaction.findMany({
      include: {
        product: { select: { name: true } },
        creator: { select: { fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  // Bugungi kirim/chiqim
  const todayIncome = todayTransactions
    .filter((t) => t.type === 'KIRIM')
    .reduce((s, t) => s + t.quantity, 0);
  const todayExpense = todayTransactions
    .filter((t) => t.type === 'CHIQIM')
    .reduce((s, t) => s + t.quantity, 0);

  // Bugungi foyda
  const todayProfit = todayTransactions
    .filter((t) => t.type === 'CHIQIM')
    .reduce((s, t) => s + t.quantity * (Number(t.product.sellPrice) - Number(t.product.buyPrice)), 0);

  // Jami qoldiq (barcha mahsulotlar)
  const products = await prisma.product.findMany({ include: { transactions: true } });
  const totalBalance = products.reduce((sum, p) => {
    const inc = p.transactions.filter((t) => t.type === 'KIRIM').reduce((s, t) => s + t.quantity, 0);
    const exp = p.transactions.filter((t) => t.type === 'CHIQIM').reduce((s, t) => s + t.quantity, 0);
    return sum + (inc - exp);
  }, 0);

  return NextResponse.json({
    totalEmployees,
    todayPresent,
    totalProducts,
    todayIncome,
    todayExpense,
    totalBalance,
    todayProfit,
    recentNotifications,
    recentTransactions,
  });
}
