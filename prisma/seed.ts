import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin foydalanuvchi yaratish
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { login: 'admin' },
    update: {},
    create: {
      fullName: 'Administrator',
      login: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+998901234567',
      address: 'Toshkent, O\'zbekiston',
    },
  });

  console.log('✅ Admin foydalanuvchi yaratildi:', admin);

  // Demo mahsulotlar
  const products = [
    { name: 'Suv 0.5L', buyPrice: 1000, sellPrice: 2000 },
    { name: 'Coca Cola 1L', buyPrice: 5000, sellPrice: 8000 },
    { name: 'Pepsi 1L', buyPrice: 4500, sellPrice: 7500 },
    { name: 'Fanta 1L', buyPrice: 4500, sellPrice: 7500 },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: {
        ...product,
        createdBy: admin.id,
      },
    });
  }

  console.log('✅ Demo mahsulotlar yaratildi');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
