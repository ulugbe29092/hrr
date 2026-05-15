'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, FileSpreadsheet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { formatCurrency } from '@/lib/utils';

interface ReportProduct {
  id: number;
  name: string;
  income: number;
  expense: number;
  balance: number;
  profit: number;
}

interface ReportData {
  period: string;
  products: ReportProduct[];
  totalIncome: number;
  totalExpense: number;
  totalProfit: number;
  employees: Array<{
    id: number;
    fullName: string;
    workHours: number;
    transactions: number;
  }>;
}

type Period = 'daily' | 'weekly' | 'monthly';

export default function ReportsPage() {
  const t = useTranslations('reports');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null);

  const period = (searchParams.get('period') as Period) || 'daily';

  useEffect(() => {
    fetchReport();
  }, [period]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports?period=${period}`);
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const setPeriod = (p: Period) => {
    router.push(`${pathname}?period=${p}`);
  };

  const handleExportPDF = async () => {
    if (!data) return;
    setExporting('pdf');
    try {
      const { generatePDFReport } = await import('@/lib/pdf');
      const doc = generatePDFReport({
        period: data.period,
        products: data.products,
        totalProfit: data.totalProfit,
        employees: data.employees,
      });
      doc.save(`hisobot-${period}-${new Date().toISOString().split('T')[0]}.pdf`);
    } finally {
      setExporting(null);
    }
  };

  const handleExportExcel = async () => {
    if (!data) return;
    setExporting('excel');
    try {
      const { generateExcelReport } = await import('@/lib/excel');
      const buffer = generateExcelReport({
        period: data.period,
        products: data.products,
        totalProfit: data.totalProfit,
        employees: data.employees,
      });
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hisobot-${period}-${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(null);
    }
  };

  const periods: { key: Period; label: string }[] = [
    { key: 'daily', label: t('daily') },
    { key: 'weekly', label: t('weekly') },
    { key: 'monthly', label: t('monthly') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex items-center gap-2"
            onClick={handleExportPDF}
            isLoading={exporting === 'pdf'}
            disabled={!data}
          >
            <FileText size={18} /> {t('downloadPDF')}
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={handleExportExcel}
            isLoading={exporting === 'excel'}
            disabled={!data}
          >
            <FileSpreadsheet size={18} /> {t('downloadExcel')}
          </Button>
        </div>
      </div>

      {/* Period Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {periods.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              period === p.key
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      ) : data ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Jami kirim</p>
                  <p className="text-2xl font-bold text-blue-700 mt-1">{data.totalIncome} ta</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Jami chiqim</p>
                  <p className="text-2xl font-bold text-orange-700 mt-1">{data.totalExpense} ta</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <TrendingDown className="w-7 h-7 text-orange-600" />
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Jami foyda</p>
                  <p className="text-2xl font-bold text-green-700 mt-1">{formatCurrency(data.totalProfit)}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <DollarSign className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Products Table */}
          <Card title="Mahsulotlar bo'yicha hisobot">
            <Table>
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Mahsulot</Th>
                  <Th>Kirim</Th>
                  <Th>Chiqim</Th>
                  <Th>Qoldiq</Th>
                  <Th>Foyda</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.products.map((p, i) => (
                  <Tr key={p.id}>
                    <Td className="text-gray-500">{i + 1}</Td>
                    <Td className="font-medium">{p.name}</Td>
                    <Td><Badge variant="info">{p.income} ta</Badge></Td>
                    <Td><Badge variant="warning">{p.expense} ta</Badge></Td>
                    <Td>
                      <Badge variant={p.balance < 5 ? 'danger' : 'success'}>{p.balance} ta</Badge>
                    </Td>
                    <Td className="font-semibold text-green-700">{formatCurrency(p.profit)}</Td>
                  </Tr>
                ))}
                <Tr>
                  <Td colSpan={5} className="font-bold text-right">Jami foyda:</Td>
                  <Td className="font-bold text-green-700 text-base">{formatCurrency(data.totalProfit)}</Td>
                </Tr>
              </Tbody>
            </Table>
          </Card>

          {/* Employees Table */}
          <Card title="Xodimlar bo'yicha hisobot">
            <Table>
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Xodim</Th>
                  <Th>Ish soatlari</Th>
                  <Th>Tranzaksiyalar</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.employees.map((e, i) => (
                  <Tr key={e.id}>
                    <Td className="text-gray-500">{i + 1}</Td>
                    <Td className="font-medium">{e.fullName}</Td>
                    <Td>{e.workHours.toFixed(1)} soat</Td>
                    <Td>{e.transactions} ta</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>
        </motion.div>
      ) : (
        <p className="text-gray-500 text-center py-12">Ma'lumot topilmadi</p>
      )}
    </div>
  );
}
