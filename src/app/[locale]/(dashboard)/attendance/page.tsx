'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Plus, Edit } from 'lucide-react';
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
  date: z.string().min(1, 'Sana kiritilishi shart'),
  arrivedAt: z.string().min(1, 'Kelish vaqti kiritilishi shart'),
  leftAt: z.string().optional(),
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
    reset({ date: new Date().toISOString().split('T')[0] });
    setIsModalOpen(true);
  };

  const openEdit = (rec: AttendanceRecord) => {
    setEditId(rec.id);
    reset({
      userId: String(rec.user.id),
      date: rec.date.split('T')[0],
      arrivedAt: rec.arrivedAt.slice(0, 16),
      leftAt: rec.leftAt ? rec.leftAt.slice(0, 16) : '',
      note: rec.note || '',
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const url = editId ? `/api/attendance/${editId}` : '/api/attendance';
      const method = editId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(data.userId),
          date: data.date,
          arrivedAt: data.arrivedAt,
          leftAt: data.leftAt || undefined,
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{t('nav.attendance')}</h1>
        {canEdit && (
          <Button className="flex items-center gap-2" onClick={openAdd}>
            <Plus size={18} /> Davomat qo'shish
          </Button>
        )}
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
        </motion.div>
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
          <Input
            label="Kelish vaqti"
            type="datetime-local"
            error={errors.arrivedAt?.message}
            {...register('arrivedAt')}
          />
          <Input
            label="Ketish vaqti (ixtiyoriy)"
            type="datetime-local"
            {...register('leftAt')}
          />
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
