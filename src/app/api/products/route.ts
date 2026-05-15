import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Barcha mahsulotlarni olish
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
          },
        },
        transactions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Har bir mahsulot uchun kirim, chiqim va qoldiqni hisoblash
    const productsWithStats = products.map((product) => {
      const income = product.transactions
        .filter((t) => t.type === 'KIRIM')
        .reduce((sum, t) => sum + t.quantity, 0);

      const expense = product.transactions
        .filter((t) => t.type === 'CHIQIM')
        .reduce((sum, t) => sum + t.quantity, 0);

      const balance = income - expense;

      const profit =
        expense * (Number(product.sellPrice) - Number(product.buyPrice));

      return {
        ...product,
        income,
        expense,
        balance,
        profit,
      };
    });

    return NextResponse.json(productsWithStats);
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Yangi mahsulot qo'shish
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, buyPrice, sellPrice, image } = body;

    if (!name || !buyPrice || !sellPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        buyPrice,
        sellPrice,
        image,
        createdBy: parseInt(session.user.id),
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Products POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
