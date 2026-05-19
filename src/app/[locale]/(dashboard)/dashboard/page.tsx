'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { useParams } from 'next/navigation';
import {
  Users, Package, TrendingUp, TrendingDown,
  DollarSign, Activity, LayoutGrid,
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
  employeesStats: Array<{
    id: number;
    fullName: string;
    role: string;
    avatar?: string;
    kirim: number;
    chiqim: number;
    jami: number;
  }>;
}

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const { locale } = useParams();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashboardRes] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/check-stock'),
      ]);
      
      if (dashboardRes.ok) {
        const dashboardData = await dashboardRes.json();
        console.log('Dashboard Data:', dashboardData);
        console.log('Employees Stats:', dashboardData.employeesStats);
        setData(dashboardData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Ma'lumot yuklanmadi</p>
      </div>
    );
  }

  const statCards = [
    { title: t('totalEmployees'), value: data.totalEmployees, icon: <Users className="w-7 h-7 text-blue-600" />, bg: 'bg-blue-50' },
    { title: t('todayPresent'), value: data.todayPresent, icon: <Activity className="w-7 h-7 text-green-600" />, bg: 'bg-green-50' },
    { title: t('totalProducts'), value: data.totalProducts, icon: <Package className="w-7 h-7 text-purple-600" />, bg: 'bg-purple-50' },
    { title: t('todayIncome'), value: `${data.todayIncome} ta`, icon: <TrendingUp className="w-7 h-7 text-emerald-600" />, bg: 'bg-emerald-50' },
    { title: t('todayExpense'), value: `${data.todayExpense} ta`, icon: <TrendingDown className="w-7 h-7 text-red-600" />, bg: 'bg-red-50' },
    { title: t('totalBalance'), value: `${data.totalBalance} ta`, icon: <LayoutGrid className="w-7 h-7 text-orange-600" />, bg: 'bg-orange-50' },
    { title: t('todayProfit'), value: formatCurrency(data.todayProfit), icon: <DollarSign className="w-7 h-7 text-yellow-600" />, bg: 'bg-yellow-50' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>

      {/* Stat Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.slice(0, 6).map((stat, i) => (
          <div
            key={stat.title}
            className="animate-fadeIn"
            style={{ animationDelay: `${i * 70}ms` }}
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
          </div>
        ))}
        
        {/* Bugungi foyda - 2 ustun */}
        <div
          className="sm:col-span-2 animate-fadeIn"
          style={{ animationDelay: '420ms' }}
        >
          <Card className="hover:shadow-lg transition-shadow cursor-default">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{statCards[6].title}</p>
                <p className="text-2xl font-bold text-green-700">{statCards[6].value}</p>
              </div>
              <div className={`p-3 rounded-xl ${statCards[6].bg}`}>
                {statCards[6].icon}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employees with Stats */}
        <div className="animate-fadeIn" style={{ animationDelay: '500ms' }}>
          <Card title="Xodimlar statistikasi">
            {!data.employeesStats || data.employeesStats.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-gray-400">
                <Users size={48} className="mb-3 opacity-30" />
                <p className="text-sm font-medium">Xodim yo'q</p>
                <p className="text-xs mt-1 text-center">
                  Xodim qo'shing
                </p>
                <Link 
                  href={`/${locale}/admin/users`}
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  Xodim qo'shish
                </Link>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {data.employeesStats.map((employee) => (
                  <div key={employee.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:shadow-md transition-all border border-gray-100">
                    {employee.avatar ? (
                      <img src={employee.avatar} alt={employee.fullName} className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-primary-200" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                        {employee.fullName?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-base text-gray-900 truncate">{employee.fullName}</p>
                      <p className="text-xs text-gray-500 font-medium mb-2">{employee.role}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <span className="text-green-600 font-bold text-lg">↑</span>
                          <span className="text-xs text-green-700 font-semibold">{employee.kirim || 0} kirim</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-red-600 font-bold text-lg">↓</span>
                          <span className="text-xs text-red-700 font-semibold">{employee.chiqim || 0} chiqim</span>
                        </div>
                        <div className="flex items-center gap-1 ml-auto">
                          <span className="text-blue-600 font-bold">Σ</span>
                          <span className="text-sm text-blue-700 font-bold">{employee.jami || 0} ta</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Link href={`/${locale}/admin/users`} className="block text-center text-sm text-primary-600 hover:text-primary-700 hover:underline pt-2 font-medium">
                  Barcha xodimlarni ko'rish →
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Recent Transactions */}
        <div className="animate-fadeIn" style={{ animationDelay: '600ms' }}>
          <Card title={t('recentTransactions')}>
            {data.recentTransactions.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Tranzaksiya yo'q</p>
            ) : (
              <div className="space-y-3">
                {data.recentTransactions.map((tx) => (
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
        </div>
      </div>
    </div>
  );
}
