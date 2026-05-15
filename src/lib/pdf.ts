import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportData {
  period: string;
  products: Array<{
    name: string;
    income: number;
    expense: number;
    balance: number;
    profit: number;
  }>;
  totalProfit: number;
  employees: Array<{
    name: string;
    workHours: number;
    transactions: number;
  }>;
}

export function generatePDFReport(data: ReportData): jsPDF {
  const doc = new jsPDF();

  // Sarlavha
  doc.setFontSize(18);
  doc.text('Do\'kon Tizimi - Hisobot', 14, 20);

  doc.setFontSize(12);
  doc.text(`Davr: ${data.period}`, 14, 30);

  // Mahsulotlar jadvali
  doc.setFontSize(14);
  doc.text('Mahsulotlar', 14, 45);

  autoTable(doc, {
    startY: 50,
    head: [['Mahsulot', 'Kirim', 'Chiqim', 'Qoldiq', 'Foyda']],
    body: data.products.map((p) => [
      p.name,
      p.income.toString(),
      p.expense.toString(),
      p.balance.toString(),
      p.profit.toFixed(2) + ' so\'m',
    ]),
    foot: [['Jami', '', '', '', data.totalProfit.toFixed(2) + ' so\'m']],
  });

  // Xodimlar jadvali
  const finalY = (doc as any).lastAutoTable.finalY || 50;
  doc.setFontSize(14);
  doc.text('Xodimlar', 14, finalY + 15);

  autoTable(doc, {
    startY: finalY + 20,
    head: [['Xodim', 'Ish soatlari', 'Tranzaksiyalar']],
    body: data.employees.map((e) => [
      e.name,
      e.workHours.toFixed(1),
      e.transactions.toString(),
    ]),
  });

  return doc;
}
