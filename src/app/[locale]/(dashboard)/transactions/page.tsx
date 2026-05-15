'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { formatDateTime } from '@/lib/utils';

interface Transaction {
  id: number;
  type: 'KIRIM' | 'CHIQIM';
  quantity: number;
  note?: string;
  createdAt: string;
  product: { name: string };
  creator: { fullName: string };
}

export default function TransactionsPage() {
  const t = useTranslations('transactions');
  const { locale } = useParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'KIRIM' | 'CHIQIM'>('ALL');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transactions');
      if (res.ok) setTransactions(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'ALL'
    ? transactions
    : transactions.filter((t) => t.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <div className="flex gap-3">
          <Link href={`/${locale}/transactions/income`}>
            <Button variant="secondary" className="flex items-center gap-2">
              <Plus size={18} /> {t('addIncome')}
            </Button>
          </Link>
          <Link href={`/${locale}/transactions/expense`}>
            <Button className="flex items-center gap-2">
              <Plus size={18} /> {t('addExpense')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['ALL', 'KIRIM', 'CHIQIM'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {f === 'ALL' ? 'Barchasi' : f}
          </button>
        ))}
      </div>

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
                <Th>{t('product')}</Th>
                <Th>{t('type')}</Th>
                <Th>{t('quantity')}</Th>
                <Th>{t('note')}</Th>
                <Th>{t('createdBy')}</Th>
                <Th>{t('date')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.length === 0 ? (
                <Tr>
                  <Td colSpan={7} className="text-center text-gray-500 py-8">
                    Tranzaksiya topilmadi
                  </Td>
                </Tr>
              ) : (
                filtered.map((tx, i) => (
                  <Tr key={tx.id}>
                    <Td className="text-gray-500">{i + 1}</Td>
                    <Td className="font-medium">{tx.product.name}</Td>
                    <Td>
                      <Badge variant={tx.type === 'KIRIM' ? 'success' : 'warning'}>
                        {tx.type}
                      </Badge>
                    </Td>
                    <Td>{tx.quantity} ta</Td>
                    <Td className="text-gray-500">{tx.note || '—'}</Td>
                    <Td>{tx.creator.fullName}</Td>
                    <Td className="text-gray-500">{formatDateTime(tx.createdAt)}</Td>
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
