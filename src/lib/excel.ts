import * as XLSX from 'xlsx';

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

export function generateExcelReport(data: ReportData): ArrayBuffer {
  const workbook = XLSX.utils.book_new();

  // Mahsulotlar sheet
  const productsData = [
    ['Do\'kon Tizimi - Hisobot'],
    [`Davr: ${data.period}`],
    [],
    ['Mahsulot', 'Kirim', 'Chiqim', 'Qoldiq', 'Foyda (so\'m)'],
    ...data.products.map((p) => [
      p.name,
      p.income,
      p.expense,
      p.balance,
      p.profit.toFixed(2),
    ]),
    [],
    ['Jami foyda:', '', '', '', data.totalProfit.toFixed(2)],
  ];

  const productsSheet = XLSX.utils.aoa_to_sheet(productsData);
  XLSX.utils.book_append_sheet(workbook, productsSheet, 'Mahsulotlar');

  // Xodimlar sheet
  const employeesData = [
    ['Xodimlar'],
    [],
    ['Xodim', 'Ish soatlari', 'Tranzaksiyalar'],
    ...data.employees.map((e) => [e.name, e.workHours.toFixed(1), e.transactions]),
  ];

  const employeesSheet = XLSX.utils.aoa_to_sheet(employeesData);
  XLSX.utils.book_append_sheet(workbook, employeesSheet, 'Xodimlar');

  // Buffer ga aylantirish
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return excelBuffer;
}
