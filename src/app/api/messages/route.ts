import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const messages = await prisma.message.findMany({
    include: {
      creator: { select: { id: true, fullName: true, avatar: true } },
      replyToMessage: {
        select: {
          body: true,
          creator: { select: { fullName: true } },
        },
      },
    },
    orderBy: { createdAt: 'asc' }, // Eski xabarlar birinchi, yangilari oxirida
  });

  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { body, image, file, fileName, replyTo } = await req.json();

  if (!body && !image && !file) {
    return NextResponse.json({ error: 'Xabar yoki fayl kiritilishi shart' }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      body: body || '',
      image: image || null,
      file: file || null,
      fileName: fileName || null,
      replyTo: replyTo || null,
      createdBy: parseInt(session.user.id),
    },
    include: { 
      creator: { select: { id: true, fullName: true, avatar: true } },
      replyToMessage: {
        select: {
          body: true,
          creator: { select: { fullName: true } },
        },
      },
    },
  });

  return NextResponse.json(message, { status: 201 });
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Barcha xabarlarni o'chirish
  await prisma.message.deleteMany({});

  return NextResponse.json({ message: 'Barcha xabarlar o\'chirildi' });
}
