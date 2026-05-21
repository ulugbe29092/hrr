'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, DollarSign, Package, Activity, Download, FileText } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { formatCurrency, formatDateTime } from '@/lib/utils';

interface StatData {
  period: string;
  totalSales: number;
  totalIncome: number;
  totalExpense: number;
  totalProfit: number;
  topProducts: Array<{
    name: string;
    quantity: number;
    profit: number;
  }>;
  salesByHour?: Array<{ hour: number; count: number }>;
  comparison: {
    percentChange: number;
    isIncrease: boolean;
  };
}

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

export default function StatisticsPage() {
  const [period, setPeriod] = useState<Period>('daily');
  const [data, setData] = useState<StatData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, [period]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/statistics?period=${period}`);
      if (res.ok) {
        setData(await res.json());
      }
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!data) return;

    const csvContent = [
      ['Statistika Hisoboti', periodLabels[period]],
      [''],
      ['Jami sotuvlar', data.totalSales + ' ta'],
      ['Jami kirim', data.totalIncome + ' ta'],
      ['Jami chiqim', data.totalExpense + ' ta'],
      ['Jami foyda', formatCurrency(data.totalProfit)],
      [''],
      ['Eng ko\'p sotilgan mahsulotlar'],
      ['#', 'Mahsulot', 'Sotildi', 'Foyda'],
      ...data.topProducts.map((p, i) => [
        (i + 1).toString(),
        p.name,
        p.quantity + ' ta',
        formatCurrency(p.profit),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `statistika_${period}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToPDF = async () => {
    if (!data) return;
    
    const { jsPDF } = await import('jspdf');
    await import('jspdf-autotable');
    
    const doc = new jsPDF() as any;
    
    doc.setFontSize(18);
    doc.text('Statistika Hisoboti', 14, 20);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`${periodLabels[period]} - ${new Date().toLocaleDateString('uz-UZ')}`, 14, 28);
    
    // Stats summary
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Jami sotuvlar: ${data.totalSales} ta`, 14, 40);
    doc.text(`Jami kirim: ${data.totalIncome} ta`, 14, 48);
    doc.text(`Jami chiqim: ${data.totalExpense} ta`, 14, 56);
    doc.text(`Jami foyda: ${formatCurrency(data.totalProfit)}`, 14, 64);
    
    // Top products table
    const tableData = data.topProducts.map((p, i) => [
      (i + 1).toString(),
      p.name,
      p.quantity + ' ta',
      formatCurrency(p.profit),
    ]);
    
    doc.autoTable({
      startY: 75,
      head: [['#', 'Mahsulot', 'Sotildi', 'Foyda']],
      body: tableData,
      styles: { font: 'helvetica', fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });
    
    doc.save(`statistika_${period}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const periodLabels = {
    daily: 'Kunlik',
    weekly: 'Haftalik',
    monthly: 'Oylik',
    yearly: 'Yillik',
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Statistika</h1>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Export Buttons */}
          <div className="flex gap-2">
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

          {/* Period Selector */}
          <div className="flex gap-2">
            {(['daily', 'weekly', 'monthly', 'yearly'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm flex-1 sm:flex-initial ${
                  period === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {periodLabels[p]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="animate-fadeIn">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Jami sotuvlar</p>
                <p className="text-2xl font-bold text-gray-900">{data?.totalSales || 0} ta</p>
                {data?.comparison && (
                  <div className={`flex items-center gap-1 mt-2 text-sm ${
                    data.comparison.isIncrease ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {data.comparison.isIncrease ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                    <span>{Math.abs(data.comparison.percentChange).toFixed(1)}%</span>
                    <span className="text-gray-500 text-xs">
                      {period === 'daily' ? 'kechadan' : period === 'weekly' ? 'o\'tgan haftadan' : period === 'monthly' ? 'o\'tgan oydan' : 'o\'tgan yildan'}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3 rounded-xl bg-blue-50">
                <Package className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="animate-fadeIn" style={{ animationDelay: '100ms' }}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Jami kirim</p>
                <p className="text-2xl font-bold text-gray-900">{data?.totalIncome || 0} ta</p>
              </div>
              <div className="p-3 rounded-xl bg-green-50">
                <TrendingUp className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Jami chiqim</p>
                <p className="text-2xl font-bold text-gray-900">{data?.totalExpense || 0} ta</p>
              </div>
              <div className="p-3 rounded-xl bg-red-50">
                <TrendingDown className="w-7 h-7 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="animate-fadeIn" style={{ animationDelay: '300ms' }}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Jami foyda</p>
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(data?.totalProfit || 0)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-50">
                <DollarSign className="w-7 h-7 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Sales by Hour (Daily only) */}
      {period === 'daily' && data?.salesByHour && (
        <div className="animate-fadeIn" style={{ animationDelay: '400ms' }}>
          <Card title="Soatlik sotuvlar">
            <div className="overflow-x-auto">
              <div className="min-w-[800px] grid grid-cols-24 gap-1 px-2">
                {Array.from({ length: 24 }, (_, i) => {
                  const hourData = data.salesByHour?.find(h => h.hour === i);
                  const count = hourData?.count || 0;
                  const maxCount = Math.max(...(data.salesByHour?.map(h => h.count) || [1]));
                  const heightPercent = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  
                  return (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-full flex flex-col justify-end items-center" style={{ height: '120px' }}>
                        <div className="text-xs font-bold text-gray-700 mb-1">{count}</div>
                        <div
                          className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-500"
                          style={{
                            height: `${Math.max(heightPercent, count > 0 ? 10 : 0)}%`,
                            minHeight: count > 0 ? '20px' : '0px',
                          }}
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-xs font-medium text-gray-600">{i}:00</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Top Products */}
      <div className="animate-fadeIn" style={{ animationDelay: '500ms' }}>
        <Card title="Eng ko'p sotilgan mahsulotlar">
          <Table>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Mahsulot</Th>
                <Th>Sotildi</Th>
                <Th>Foyda</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.topProducts && data.topProducts.length > 0 ? (
                data.topProducts.map((product, i) => (
                  <Tr key={i}>
                    <Td className="text-gray-500">{i + 1}</Td>
                    <Td className="font-medium">{product.name}</Td>
                    <Td>
                      <Badge variant="success">{product.quantity} ta</Badge>
                    </Td>
                    <Td className="font-semibold text-green-700">
                      {formatCurrency(product.profit)}
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={4} className="text-center text-gray-500 py-8">
                    Ma'lumot yo'q
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
