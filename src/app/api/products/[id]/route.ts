import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      creator: { select: { id: true, fullName: true } },
      transactions: {
        include: { creator: { select: { id: true, fullName: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const income = product.transactions.filter((t) => t.type === 'KIRIM').reduce((s, t) => s + t.quantity, 0);
  const expense = product.transactions.filter((t) => t.type === 'CHIQIM').reduce((s, t) => s + t.quantity, 0);
  const balance = income - expense;
  const profit = expense * (Number(product.sellPrice) - Number(product.buyPrice));

  return NextResponse.json({ ...product, income, expense, balance, profit });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, buyPrice, sellPrice, image } = body;

  try {
    const product = await prisma.product.update({
      where: { id: parseInt(params.id) },
      data: { name, buyPrice, sellPrice, image },
    });
    return NextResponse.json(product);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Bu nomli mahsulot allaqachon mavjud' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.product.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ success: true });
}
