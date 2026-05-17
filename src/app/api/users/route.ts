import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      login: true,
      role: true,
      phone: true,
      address: true,
      avatar: true,
      createdAt: true,
      transactions: {
        select: {
          type: true,
          quantity: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate statistics for each user
  const usersWithStats = users.map((user) => {
    const totalIncome = user.transactions
      .filter((t) => t.type === 'KIRIM')
      .reduce((sum, t) => sum + t.quantity, 0);
    const totalExpense = user.transactions
      .filter((t) => t.type === 'CHIQIM')
      .reduce((sum, t) => sum + t.quantity, 0);

    const { transactions, ...userWithoutTransactions } = user;
    return {
      ...userWithoutTransactions,
      totalIncome,
      totalExpense,
    };
  });

  return NextResponse.json(usersWithStats);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const { fullName, login, password, role, phone, address } = body;

  if (!fullName || !login || !password || !role) {
    return NextResponse.json({ error: 'Majburiy maydonlar to\'ldirilmagan' }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { fullName, login, password: hashedPassword, role, phone, address },
      select: { id: true, fullName: true, login: true, role: true, createdAt: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Bu login allaqachon band' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
