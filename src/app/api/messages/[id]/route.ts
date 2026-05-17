import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { body, image, file, fileName } = await req.json();
  const messageId = parseInt(params.id);

  // Faqat o'z xabarini tahrirlash mumkin
  const existingMessage = await prisma.message.findUnique({
    where: { id: messageId },
  });

  if (!existingMessage || existingMessage.createdBy !== parseInt(session.user.id)) {
    return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 });
  }

  const message = await prisma.message.update({
    where: { id: messageId },
    data: {
      body: body || existingMessage.body,
      image: image || existingMessage.image,
      file: file || existingMessage.file,
      fileName: fileName || existingMessage.fileName,
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

  return NextResponse.json(message);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const messageId = parseInt(params.id);

  // Faqat o'z xabarini o'chirish mumkin
  const existingMessage = await prisma.message.findUnique({
    where: { id: messageId },
  });

  if (!existingMessage || existingMessage.createdBy !== parseInt(session.user.id)) {
    return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 });
  }

  await prisma.message.delete({
    where: { id: messageId },
  });

  return NextResponse.json({ success: true });
}
