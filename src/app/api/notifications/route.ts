import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const notifications = await prisma.notification.findMany({
    include: {
      creator: { select: { id: true, fullName: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return NextResponse.json(notifications);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { title, body } = await req.json();

  if (!title || !body) {
    return NextResponse.json({ error: 'Sarlavha va matn kiritilishi shart' }, { status: 400 });
  }

  const notification = await prisma.notification.create({
    data: {
      title,
      body,
      createdBy: parseInt(session.user.id),
    },
    include: { creator: { select: { id: true, fullName: true } } },
  });

  return NextResponse.json(notification, { status: 201 });
}
