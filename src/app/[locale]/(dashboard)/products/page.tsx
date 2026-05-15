'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Eye } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';

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
}

export default function ProductsPage() {
  const t = useTranslations('products');
  const { locale } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <Link href={`/${locale}/products/add`}>
          <Button className="flex items-center gap-2">
            <Plus size={20} />
            {t('addProduct')}
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="max-w-sm">
        <Input
          placeholder={`${t('productName')} bo'yicha qidirish...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Table>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>{t('productName')}</Th>
                <Th>{t('buyPrice')}</Th>
                <Th>{t('sellPrice')}</Th>
                <Th>{t('totalIncome')}</Th>
                <Th>{t('totalExpense')}</Th>
                <Th>{t('balance')}</Th>
                <Th>{t('profit')}</Th>
                <Th>Amallar</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.length === 0 ? (
                <Tr>
                  <Td colSpan={9} className="text-center text-gray-500 py-8">
                    Mahsulot topilmadi
                  </Td>
                </Tr>
              ) : (
                filtered.map((product, i) => (
                  <Tr key={product.id}>
                    <Td className="text-gray-500">{i + 1}</Td>
                    <Td className="font-medium">{product.name}</Td>
                    <Td>{formatCurrency(product.buyPrice)}</Td>
                    <Td>{formatCurrency(product.sellPrice)}</Td>
                    <Td>
                      <Badge variant="info">{product.income} ta</Badge>
                    </Td>
                    <Td>
                      <Badge variant="warning">{product.expense} ta</Badge>
                    </Td>
                    <Td>
                      <Badge variant={product.balance < 5 ? 'danger' : 'success'}>
                        {product.balance} ta
                      </Badge>
                    </Td>
                    <Td className="font-semibold text-green-700">
                      {formatCurrency(product.profit)}
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <Link href={`/${locale}/products/${product.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye size={16} />
                          </Button>
                        </Link>
                        <Link href={`/${locale}/products/${product.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit size={16} />
                          </Button>
                        </Link>
                      </div>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </motion.div>
      )}
    </div>
  );
}
