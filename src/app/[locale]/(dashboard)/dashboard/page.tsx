'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users, Package, TrendingUp, TrendingDown,
  DollarSign, Activity, LayoutGrid, Bell,
} from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDateTime } from '@/lib/utils';

interface DashboardData {
  totalEmployees: number;
  todayPresent: number;
  totalProducts: number;
  todayIncome: number;
  todayExpense: number;
  totalBalance: number;
  todayProfit: number;
  recentNotifications: Array<{ id: number; title: string; body: string; createdAt: string }>;
  recentTransactions: Array<{
    id: number;
    type: string;
    quantity: number;
    createdAt: string;
    product: { name: string };
    creator: { fullName: string };
  }>;
}

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const { locale } = useParams();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const statCards = data
    ? [
        { title: t('totalEmployees'), value: data.totalEmployees, icon: <Users className="w-7 h-7 text-blue-600" />, bg: 'bg-blue-50' },
        { title: t('todayPresent'), value: data.todayPresent, icon: <Activity className="w-7 h-7 text-green-600" />, bg: 'bg-green-50' },
        { title: t('totalProducts'), value: data.totalProducts, icon: <Package className="w-7 h-7 text-purple-600" />, bg: 'bg-purple-50' },
        { title: t('todayIncome'), value: `${data.todayIncome} ta`, icon: <TrendingUp className="w-7 h-7 text-emerald-600" />, bg: 'bg-emerald-50' },
        { title: t('todayExpense'), value: `${data.todayExpense} ta`, icon: <TrendingDown className="w-7 h-7 text-red-600" />, bg: 'bg-red-50' },
        { title: t('totalBalance'), value: `${data.totalBalance} ta`, icon: <LayoutGrid className="w-7 h-7 text-orange-600" />, bg: 'bg-orange-50' },
        { title: t('todayProfit'), value: formatCurrency(data.todayProfit), icon: <DollarSign className="w-7 h-7 text-yellow-600" />, bg: 'bg-yellow-50' },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-default">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>{stat.icon}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card title={t('recentNotifications')}>
            {data?.recentNotifications.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-gray-400">
                <Bell size={32} className="mb-2 opacity-30" />
                <p className="text-sm">Bildirishnoma yo'q</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data?.recentNotifications.map((n) => (
                  <div key={n.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-gray-900">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                    </div>
                  </div>
                ))}
                <Link href={`/${locale}/notifications`} className="block text-center text-sm text-primary-600 hover:underline pt-1">
                  Barchasini ko'rish →
                </Link>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card title={t('recentTransactions')}>
            {data?.recentTransactions.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Tranzaksiya yo'q</p>
            ) : (
              <div className="space-y-3">
                {data?.recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{tx.product.name}</p>
                      <p className="text-xs text-gray-500">{tx.creator.fullName} • {formatDateTime(tx.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={tx.type === 'KIRIM' ? 'success' : 'warning'}>{tx.type}</Badge>
                      <span className="text-sm font-semibold">{tx.quantity} ta</span>
                    </div>
                  </div>
                ))}
                <Link href={`/${locale}/transactions`} className="block text-center text-sm text-primary-600 hover:underline pt-1">
                  Barchasini ko'rish →
                </Link>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
