import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { login: 'ulugbek' },
    });

    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: 'Admin foydalanuvchi allaqachon mavjud',
        user: {
          login: existingAdmin.login,
          fullName: existingAdmin.fullName,
          role: existingAdmin.role,
        },
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('ulugbek', 10);

    const admin = await prisma.user.create({
      data: {
        fullName: 'Ulugbek',
        login: 'ulugbek',
        password: hashedPassword,
        role: 'ADMIN',
        phone: '+998901234567',
        address: 'Toshkent, O\'zbekiston',
      },
    });

    // Create demo products
    const products = [
      { name: 'Suv 0.5L', buyPrice: 1000, sellPrice: 2000 },
      { name: 'Coca Cola 1L', buyPrice: 5000, sellPrice: 8000 },
      { name: 'Pepsi 1L', buyPrice: 4500, sellPrice: 7500 },
      { name: 'Fanta 1L', buyPrice: 4500, sellPrice: 7500 },
    ];

    for (const product of products) {
      await prisma.product.create({
        data: {
          ...product,
          createdBy: admin.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Admin foydalanuvchi va demo mahsulotlar yaratildi!',
      user: {
        login: admin.login,
        fullName: admin.fullName,
        role: admin.role,
      },
    });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: 'Database setup xatosi. Iltimos, DATABASE_URL to\'g\'ri sozlanganligini tekshiring.',
      },
      { status: 500 }
    );
  }
}
