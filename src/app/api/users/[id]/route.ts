import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: parseInt(params.id) },
    select: {
      id: true,
      fullName: true,
      login: true,
      role: true,
      phone: true,
      address: true,
      avatar: true,
      createdAt: true,
      attendances: {
        orderBy: { date: 'desc' },
        take: 30,
      },
      transactions: {
        include: { product: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 50,
      },
    },
  });

  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Faqat admin yoki o'zi tahrirlashi mumkin
  const isAdmin = session.user.role === 'ADMIN';
  const isSelf = session.user.id === params.id;
  if (!isAdmin && !isSelf) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { fullName, role, phone, address, avatar } = body;

  const updateData: any = { fullName, phone, address, avatar };
  if (isAdmin && role) updateData.role = role;

  const user = await prisma.user.update({
    where: { id: parseInt(params.id) },
    data: updateData,
    select: { id: true, fullName: true, role: true, phone: true, address: true, avatar: true },
  });

  return NextResponse.json(user);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // O'zini o'chira olmaydi
  if (session.user.id === params.id) {
    return NextResponse.json({ error: 'O\'zingizni o\'chira olmaysiz' }, { status: 400 });
  }

  await prisma.user.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ success: true });
}
