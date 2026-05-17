import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get all products with their transactions
    const products = await prisma.product.findMany({
      include: {
        transactions: true,
      },
    });

    const lowStockProducts = [];

    for (const product of products) {
      const income = product.transactions
        .filter((t) => t.type === 'KIRIM')
        .reduce((sum, t) => sum + t.quantity, 0);
      const expense = product.transactions
        .filter((t) => t.type === 'CHIQIM')
        .reduce((sum, t) => sum + t.quantity, 0);
      const balance = income - expense;

      // Check if stock is 0, 5, or 10
      if (balance === 0 || balance === 5 || balance === 10) {
        // Check if notification already exists for this product and balance
        const existingNotification = await prisma.notification.findFirst({
          where: {
            title: `Mahsulot qoldig'i kam`,
            body: {
              contains: product.name,
            },
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
        });

        if (!existingNotification) {
          // Get system user (admin) to create notification
          const admin = await prisma.user.findFirst({
            where: { role: 'ADMIN' },
          });

          if (admin) {
            let message = '';
            if (balance === 0) {
              message = `⚠️ ${product.name} mahsulotidan 0 ta qoldi!`;
            } else if (balance === 5) {
              message = `⚠️ ${product.name} mahsulotidan 5 ta qoldi!`;
            } else if (balance === 10) {
              message = `⚠️ ${product.name} mahsulotidan 10 ta qoldi!`;
            }

            await prisma.notification.create({
              data: {
                title: `Mahsulot qoldig'i kam`,
                body: message,
                createdBy: admin.id,
              },
            });

            lowStockProducts.push({ name: product.name, balance });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      lowStockProducts,
      message: `${lowStockProducts.length} ta mahsulot uchun xabar yuborildi`,
    });
  } catch (error) {
    console.error('Stock check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
