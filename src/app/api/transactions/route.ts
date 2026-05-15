import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Barcha tranzaksiyalarni olish
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const productId = searchParams.get('productId');

    const where: any = {};
    if (type) where.type = type;
    if (productId) where.productId = parseInt(productId);

    // Agar xodim bo'lsa, faqat o'z tranzaksiyalarini ko'radi
    if (
      session.user.role === 'SOTUVCHI' ||
      session.user.role === 'OMBORCHI'
    ) {
      where.createdBy = parseInt(session.user.id);
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        product: true,
        creator: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Transactions GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Yangi tranzaksiya qo'shish
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, type, quantity, note } = body;

    if (!productId || !type || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Sotuvchi faqat CHIQIM, Omborchi faqat KIRIM qila oladi
    if (session.user.role === 'SOTUVCHI' && type !== 'CHIQIM') {
      return NextResponse.json(
        { error: 'Sotuvchi faqat chiqim qila oladi' },
        { status: 403 }
      );
    }

    if (session.user.role === 'OMBORCHI' && type !== 'KIRIM') {
      return NextResponse.json(
        { error: 'Omborchi faqat kirim qila oladi' },
        { status: 403 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        productId: parseInt(productId),
        type,
        quantity: parseInt(quantity),
        note,
        createdBy: parseInt(session.user.id),
      },
      include: {
        product: true,
      },
    });

    // Mahsulot qoldig'i 5 dan kam bo'lsa, bildirishnoma yuborish
    const allTransactions = await prisma.transaction.findMany({
      where: { productId: parseInt(productId) },
    });

    const income = allTransactions
      .filter((t) => t.type === 'KIRIM')
      .reduce((sum, t) => sum + t.quantity, 0);

    const expense = allTransactions
      .filter((t) => t.type === 'CHIQIM')
      .reduce((sum, t) => sum + t.quantity, 0);

    const balance = income - expense;

    if (balance < 5) {
      // Admin va Boshliqqa bildirishnoma yuborish
      const admins = await prisma.user.findMany({
        where: {
          role: {
            in: ['ADMIN', 'BOSHLIQ'],
          },
        },
      });

      for (const admin of admins) {
        await prisma.notification.create({
          data: {
            title: 'Mahsulot qoldig\'i kam',
            body: `${transaction.product.name} mahsulotidan ${balance} ta qoldi!`,
            createdBy: parseInt(session.user.id),
          },
        });
      }
    }

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Transactions POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
