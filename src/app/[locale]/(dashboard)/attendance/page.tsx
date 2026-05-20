'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { useSession } from 'next-auth/react';
import { Plus, Edit, Download, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { formatDate, formatDateTime } from '@/lib/utils';

const schema = z.object({
  userId: z.string().min(1, 'Xodim tanlanishi shart'),
  date: z.string().min(1, 'Sana tanlanishi shart'),
  note: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface AttendanceRecord {
  id: number;
  date: string;
  arrivedAt: string;
  leftAt?: string;
  note?: string;
  user: { id: number; fullName: string };
}

export default function AttendancePage() {
  const t = useTranslations();
  const { data: session } = useSession();
  const { toasts, addToast, removeToast } = useToast();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const canEdit = session?.user?.role === 'ADMIN' || session?.user?.role === 'BOSHLIQ';

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [attRes, usersRes] = await Promise.all([
        fetch('/api/attendance'),
        fetch('/api/users'),
      ]);
      if (attRes.ok) setRecords(await attRes.json());
      if (usersRes.ok) {
        const users = await usersRes.json();
        setEmployees(users.map((u: any) => ({ value: String(u.id), label: u.fullName })));
      }
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditId(null);
    reset({ 
      userId: '',
      date: new Date().toISOString().split('T')[0],
      note: ''
    });
    setIsModalOpen(true);
  };

  const openEdit = (rec: AttendanceRecord) => {
    setEditId(rec.id);
    reset({
      userId: String(rec.user.id),
      date: rec.date.split('T')[0],
      note: rec.note || '',
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const url = editId ? `/api/attendance/${editId}` : '/api/attendance';
      const method = editId ? 'PATCH' : 'POST';

      // Hozirgi vaqtni olish
      const now = new Date();
      const selectedDate = new Date(data.date);
      
      // Tanlangan sanaga hozirgi vaqtni qo'shish
      selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(data.userId),
          date: data.date,
          arrivedAt: selectedDate.toISOString(),
          note: data.note || undefined,
        }),
      });

      if (res.ok) {
        addToast(editId ? 'Davomat yangilandi' : 'Davomat qo\'shildi', 'success');
        setIsModalOpen(false);
        fetchData();
      } else {
        const err = await res.json();
        addToast(err.error || 'Xatolik yuz berdi', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Davomat Hisoboti', new Date().toLocaleDateString('uz-UZ')],
      [''],
      ['#', 'Xodim', 'Sana', 'Keldi', 'Ketdi', 'Ish soati', 'Izoh'],
      ...records.map((rec, i) => {
        const hours = rec.leftAt
          ? ((new Date(rec.leftAt).getTime() - new Date(rec.arrivedAt).getTime()) / 3600000).toFixed(1)
          : '—';
        return [
          (i + 1).toString(),
          rec.user.fullName,
          formatDate(rec.date),
          formatDateTime(rec.arrivedAt),
          rec.leftAt ? formatDateTime(rec.leftAt) : 'Hali ketmagan',
          hours + ' soat',
          rec.note || '—',
        ];
      }),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `davomat_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToPDF = async () => {
    const { jsPDF } = await import('jspdf');
    await import('jspdf-autotable');
    
    const doc = new jsPDF() as any;
    
    doc.setFontSize(18);
    doc.text('Davomat Hisoboti', 14, 20);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(new Date().toLocaleDateString('uz-UZ'), 14, 28);
    
    const tableData = records.map((rec, i) => {
      const hours = rec.leftAt
        ? ((new Date(rec.leftAt).getTime() - new Date(rec.arrivedAt).getTime()) / 3600000).toFixed(1)
        : '—';
      return [
        (i + 1).toString(),
        rec.user.fullName,
        formatDate(rec.date),
        formatDateTime(rec.arrivedAt),
        rec.leftAt ? formatDateTime(rec.leftAt) : 'Hali ketmagan',
        hours + ' soat',
        rec.note || '—',
      ];
    });
    
    doc.autoTable({
      startY: 35,
      head: [['#', 'Xodim', 'Sana', 'Keldi', 'Ketdi', 'Ish soati', 'Izoh']],
      body: tableData,
      styles: { font: 'helvetica', fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });
    
    doc.save(`davomat_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">{t('nav.attendance')}</h1>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={exportToCSV} 
            className="flex items-center gap-2 flex-1 sm:flex-initial justify-center"
          >
            <Download size={16} />
            <span>Excel</span>
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={exportToPDF} 
            className="flex items-center gap-2 flex-1 sm:flex-initial justify-center"
          >
            <FileText size={16} />
            <span>PDF</span>
          </Button>
          {canEdit && (
            <Button 
              className="flex items-center gap-2 flex-1 sm:flex-initial justify-center" 
              onClick={openAdd}
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Davomat qo'shish</span>
              <span className="sm:hidden">Qo'shish</span>
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      ) : (
        <div className="animate-fadeIn">
          <Table>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Xodim</Th>
                <Th>Sana</Th>
                <Th>Keldi</Th>
                <Th>Ketdi</Th>
                <Th>Ish soati</Th>
                <Th>Izoh</Th>
                {canEdit && <Th>Amallar</Th>}
              </Tr>
            </Thead>
            <Tbody>
              {records.length === 0 ? (
                <Tr>
                  <Td colSpan={8} className="text-center text-gray-500 py-8">
                    Davomat ma'lumoti topilmadi
                  </Td>
                </Tr>
              ) : (
                records.map((rec, i) => {
                  const hours = rec.leftAt
                    ? ((new Date(rec.leftAt).getTime() - new Date(rec.arrivedAt).getTime()) / 3600000).toFixed(1)
                    : null;
                  return (
                    <Tr key={rec.id}>
                      <Td className="text-gray-500">{i + 1}</Td>
                      <Td className="font-medium">{rec.user.fullName}</Td>
                      <Td>{formatDate(rec.date)}</Td>
                      <Td>{formatDateTime(rec.arrivedAt)}</Td>
                      <Td>
                        {rec.leftAt
                          ? formatDateTime(rec.leftAt)
                          : <Badge variant="warning">Hali ketmagan</Badge>}
                      </Td>
                      <Td>
                        {hours
                          ? <Badge variant="success">{hours} soat</Badge>
                          : '—'}
                      </Td>
                      <Td className="text-gray-500">{rec.note || '—'}</Td>
                      {canEdit && (
                        <Td>
                          <Button variant="ghost" size="sm" onClick={() => openEdit(rec)}>
                            <Edit size={16} />
                          </Button>
                        </Td>
                      )}
                    </Tr>
                  );
                })
              )}
            </Tbody>
          </Table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editId ? 'Davomatni tahrirlash' : 'Davomat qo\'shish'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="Xodim"
            options={employees}
            placeholder="Xodim tanlang..."
            error={errors.userId?.message}
            {...register('userId')}
          />
          <Input
            label="Sana"
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              ℹ️ Kelish vaqti avtomatik hozirgi vaqt bo'ladi
            </p>
          </div>
          <Input
            label="Izoh (ixtiyoriy)"
            placeholder="..."
            {...register('note')}
          />
          <div className="flex gap-3 pt-2">
            <Button type="submit" isLoading={saving}>Saqlash</Button>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
          </div>
        </form>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
