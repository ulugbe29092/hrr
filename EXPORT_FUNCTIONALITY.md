# Excel va PDF Export Funksiyalari

## ✅ Qo'shilgan Sahifalar

Barcha asosiy sahifalarga Excel (CSV) va PDF export funksiyalari qo'shildi:

### 1. **Xodimlar** (`/admin/users`)
- ✅ Excel export (CSV format)
- ✅ PDF export
- **Ma'lumotlar**: To'liq ism, Login, Rol, Telefon, Qo'shilgan sana
- **Fayl nomi**: `xodimlar_YYYY-MM-DD.csv/pdf`

### 2. **Mahsulotlar** (`/products`)
- ✅ Excel export (CSV format)
- ✅ PDF export
- **Ma'lumotlar**: Mahsulot nomi, Narx, Qoldiq, Kategoriya, Qo'shilgan sana
- **Fayl nomi**: `mahsulotlar_YYYY-MM-DD.csv/pdf`

### 3. **Davomat** (`/attendance`)
- ✅ Excel export (CSV format)
- ✅ PDF export
- **Ma'lumotlar**: Xodim, Kelgan vaqt, Ketgan vaqt, Ish soatlari, Sana
- **Fayl nomi**: `davomat_YYYY-MM-DD.csv/pdf`

### 4. **Statistika** (`/statistics`)
- ✅ Excel export (CSV format)
- ✅ PDF export
- **Ma'lumotlar**: Umumiy statistika va grafik ma'lumotlari
- **Fayl nomi**: `statistika_YYYY-MM-DD.csv/pdf`

### 5. **Kirim/Chiqim** (`/transactions`)
- ✅ Excel export (CSV format)
- ✅ PDF export
- **Ma'lumotlar**: Mahsulot, Turi (KIRIM/CHIQIM), Miqdor, Izoh, Yaratuvchi, Sana
- **Fayl nomi**: `kirim_chiqim_YYYY-MM-DD.csv/pdf`

### 6. **Hisobotlar** (`/reports`)
- ✅ Excel export (CSV format)
- ✅ PDF export
- **Ma'lumotlar**: 
  - Mahsulotlar bo'yicha hisobot (Kirim, Chiqim, Qoldiq, Foyda)
  - Xodimlar bo'yicha hisobot (Ish soatlari, Tranzaksiyalar)
- **Fayl nomi**: `hisobotlar_[period]_YYYY-MM-DD.csv/pdf`

## 🎨 Dizayn Xususiyatlari

### Tugmalar
- **Variant**: `secondary` (kulrang rang)
- **O'lcham**: `sm` (kichik)
- **Ikonkalar**: 
  - Excel: `Download` ikoni
  - PDF: `FileText` ikoni
- **Responsive**: Mobile qurilmalarda to'liq kenglikda ko'rsatiladi

### Joylashuv
```tsx
<div className="flex flex-wrap gap-2 sm:gap-3">
  <Button variant="secondary" size="sm" onClick={exportToCSV}>
    <Download size={16} />
    <span>Excel</span>
  </Button>
  <Button variant="secondary" size="sm" onClick={exportToPDF}>
    <FileText size={16} />
    <span>PDF</span>
  </Button>
</div>
```

## 📦 Texnik Tafsilotlar

### Kutubxonalar
```json
{
  "jspdf": "^2.5.2",
  "jspdf-autotable": "^3.8.3"
}
```

### Excel Export (CSV)
- **Format**: CSV with UTF-8 BOM encoding
- **Encoding**: `\uFEFF` prefiksi qo'shiladi (Excel uchun UTF-8 support)
- **Fayl turi**: `text/csv;charset=utf-8;`
- **Yuklab olish**: Avtomatik yuklab olish (yangi oynada ochilmaydi)

### PDF Export
- **Kutubxona**: jsPDF + jspdf-autotable
- **Font**: Helvetica
- **Rang sxemasi**: 
  - Sarlavha: Blue (#3B82F6)
  - Alternativ qatorlar: Light gray (#F5F7FA)
- **Yuklab olish**: Avtomatik yuklab olish (yangi oynada ochilmaydi)

## 🔧 Kod Namunasi

### Excel Export
```typescript
const exportToCSV = () => {
  const csvContent = [
    ['Sarlavha', new Date().toLocaleDateString('uz-UZ')],
    [''],
    ['#', 'Ustun 1', 'Ustun 2', ...],
    ...data.map((item, i) => [
      (i + 1).toString(),
      item.field1,
      item.field2,
      ...
    ]),
  ]
    .map((row) => row.join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `fayl_nomi_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};
```

### PDF Export
```typescript
const exportToPDF = async () => {
  const { jsPDF } = await import('jspdf');
  await import('jspdf-autotable');
  
  const doc = new jsPDF() as any;
  
  // Sarlavha
  doc.setFontSize(18);
  doc.text('Sarlavha', 14, 20);
  
  // Sana
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(new Date().toLocaleDateString('uz-UZ'), 14, 28);
  
  // Jadval
  const tableData = data.map((item, i) => [
    (i + 1).toString(),
    item.field1,
    item.field2,
    ...
  ]);
  
  doc.autoTable({
    startY: 35,
    head: [['#', 'Ustun 1', 'Ustun 2', ...]],
    body: tableData,
    styles: { font: 'helvetica', fontSize: 10 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
  });
  
  doc.save(`fayl_nomi_${new Date().toISOString().split('T')[0]}.pdf`);
};
```

## ✅ Test Qilish

Barcha export funksiyalari quyidagi holatlar uchun test qilindi:

1. ✅ Ma'lumotlar mavjud bo'lganda
2. ✅ Ma'lumotlar bo'sh bo'lganda
3. ✅ Mobile qurilmalarda
4. ✅ Desktop qurilmalarda
5. ✅ UTF-8 belgilar (O'zbek alifbosi)
6. ✅ Fayl nomlari to'g'ri formatda

## 🚀 Deployment

Barcha o'zgarishlar GitHub'ga push qilindi:
- Repository: https://github.com/ulugbe29092/hrr
- Branch: main
- Latest commit: c49d273

## 📝 Keyingi Qadamlar

Agar qo'shimcha funksiyalar kerak bo'lsa:
1. Excel format (XLSX) qo'shish
2. PDF'ga rasm qo'shish
3. Custom styling
4. Email orqali yuborish
5. Cloud storage'ga saqlash

---

**Yaratilgan sana**: ${new Date().toLocaleDateString('uz-UZ')}
**Versiya**: 1.0.0
