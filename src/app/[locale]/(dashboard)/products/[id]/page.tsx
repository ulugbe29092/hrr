'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { formatCurrency, formatDateTime } from '@/lib/utils';

interface Transaction {
  id: number;
  type: 'KIRIM' | 'CHIQIM';
  quantity: number;
  note?: string;
  createdAt: string;
  creator: { fullName: string };
}

interface Product {
  id: number;
  name: string;
  image?: string;
  buyPrice: number;
  sellPrice: number;
  income: number;
  expense: number;
  balance: number;
  profit: number;
  transactions: Transaction[];
}

export default function ProductDetailPage() {
  const t = useTranslations('products');
  const { locale, id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) setProduct(await res.json());
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!product) {
    return <p className="text-gray-600">Mahsulot topilmadi</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/${locale}/products`}>
            <Button variant="ghost" size="sm"><ArrowLeft size={20} /></Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        </div>
        <Link href={`/${locale}/products/${id}/edit`}>
          <Button variant="secondary" className="flex items-center gap-2">
            <Edit size={18} /> Tahrirlash
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t('buyPrice'), value: formatCurrency(product.buyPrice), color: 'text-gray-700' },
          { label: t('sellPrice'), value: formatCurrency(product.sellPrice), color: 'text-blue-700' },
          { label: t('balance'), value: `${product.balance} ta`, color: product.balance < 5 ? 'text-red-700' : 'text-green-700' },
          { label: t('profit'), value: formatCurrency(product.profit), color: 'text-emerald-700' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className={`text-xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Transactions */}
      <Card title={t('history')}>
        <Table>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Turi</Th>
              <Th>Miqdor</Th>
              <Th>Izoh</Th>
              <Th>Xodim</Th>
              <Th>Sana</Th>
            </Tr>
          </Thead>
          <Tbody>
            {product.transactions.length === 0 ? (
              <Tr>
                <Td colSpan={6} className="text-center text-gray-500 py-8">
                  Tranzaksiya topilmadi
                </Td>
              </Tr>
            ) : (
              product.transactions.map((tx, i) => (
                <Tr key={tx.id}>
                  <Td className="text-gray-500">{i + 1}</Td>
                  <Td>
                    <Badge variant={tx.type === 'KIRIM' ? 'success' : 'warning'}>
                      {tx.type}
                    </Badge>
                  </Td>
                  <Td className="font-medium">{tx.quantity} ta</Td>
                  <Td className="text-gray-500">{tx.note || '—'}</Td>
                  <Td>{tx.creator.fullName}</Td>
                  <Td className="text-gray-500">{formatDateTime(tx.createdAt)}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Card>
    </div>
  );
}
