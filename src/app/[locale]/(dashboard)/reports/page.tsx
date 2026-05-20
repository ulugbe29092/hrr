'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { TrendingUp, TrendingDown, DollarSign, Download, FileText } from 'lucide-react';
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

  const periods: { key: Period; label: string }[] = [
    { key: 'daily', label: t('daily') },
    { key: 'weekly', label: t('weekly') },
    { key: 'monthly', label: t('monthly') },
  ];

  const exportToCSV = () => {
    if (!data) return;

    const csvContent = [
      ['Hisobotlar', period === 'daily' ? 'Kunlik' : period === 'weekly' ? 'Haftalik' : 'Oylik'],
      [''],
      ['Jami kirim', data.totalIncome + ' ta'],
      ['Jami chiqim', data.totalExpense + ' ta'],
      ['Jami foyda', formatCurrency(data.totalProfit)],
      [''],
      ['Mahsulotlar bo\'yicha hisobot'],
      ['#', 'Mahsulot', 'Kirim', 'Chiqim', 'Qoldiq', 'Foyda'],
      ...data.products.map((p, i) => [
        (i + 1).toString(),
        p.name,
        p.income + ' ta',
        p.expense + ' ta',
        p.balance + ' ta',
        formatCurrency(p.profit),
      ]),
      [''],
      ['Xodimlar bo\'yicha hisobot'],
      ['#', 'Xodim', 'Ish soatlari', 'Tranzaksiyalar'],
      ...data.employees.map((e, i) => [
        (i + 1).toString(),
        e.fullName,
        e.workHours.toFixed(1) + ' soat',
        e.transactions + ' ta',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `hisobotlar_${period}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToPDF = async () => {
    if (!data) return;

    const { jsPDF } = await import('jspdf');
    await import('jspdf-autotable');
    
    const doc = new jsPDF() as any;
    
    doc.setFontSize(18);
    doc.text('Hisobotlar', 14, 20);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    const periodLabel = period === 'daily' ? 'Kunlik' : period === 'weekly' ? 'Haftalik' : 'Oylik';
    doc.text(`${periodLabel} - ${new Date().toLocaleDateString('uz-UZ')}`, 14, 28);
    
    // Summary
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Jami kirim: ${data.totalIncome} ta`, 14, 40);
    doc.text(`Jami chiqim: ${data.totalExpense} ta`, 14, 48);
    doc.text(`Jami foyda: ${formatCurrency(data.totalProfit)}`, 14, 56);
    
    // Products table
    doc.setFontSize(14);
    doc.text('Mahsulotlar bo\'yicha hisobot', 14, 68);
    
    const productsData = data.products.map((p, i) => [
      (i + 1).toString(),
      p.name,
      p.income + ' ta',
      p.expense + ' ta',
      p.balance + ' ta',
      formatCurrency(p.profit),
    ]);
    
    doc.autoTable({
      startY: 73,
      head: [['#', 'Mahsulot', 'Kirim', 'Chiqim', 'Qoldiq', 'Foyda']],
      body: productsData,
      styles: { font: 'helvetica', fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });
    
    // Employees table
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text('Xodimlar bo\'yicha hisobot', 14, finalY);
    
    const employeesData = data.employees.map((e, i) => [
      (i + 1).toString(),
      e.fullName,
      e.workHours.toFixed(1) + ' soat',
      e.transactions + ' ta',
    ]);
    
    doc.autoTable({
      startY: finalY + 5,
      head: [['#', 'Xodim', 'Ish soatlari', 'Tranzaksiyalar']],
      body: employeesData,
      styles: { font: 'helvetica', fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });
    
    doc.save(`hisobotlar_${period}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={exportToCSV} 
            disabled={!data}
            className="flex items-center gap-2 flex-1 sm:flex-initial justify-center"
          >
            <Download size={16} />
            <span>Excel</span>
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={exportToPDF} 
            disabled={!data}
            className="flex items-center gap-2 flex-1 sm:flex-initial justify-center"
          >
            <FileText size={16} />
            <span>PDF</span>
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
        <div className="space-y-6 animate-fadeIn">
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
        </div>
      ) : (
        <p className="text-gray-500 text-center py-12">Ma'lumot topilmadi</p>
      )}
    </div>
  );
}
