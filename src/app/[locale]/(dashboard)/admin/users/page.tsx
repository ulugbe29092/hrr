'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Plus, Edit, Trash2, Download, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { getRoleName, formatDate } from '@/lib/utils';

interface User {
  id: number;
  fullName: string;
  login: string;
  role: string;
  phone?: string;
  createdAt: string;
}

const schema = z.object({
  fullName: z.string().min(1, 'To\'liq ism kiritilishi shart'),
  login: z.string().min(3, 'Login kamida 3 ta belgi bo\'lishi kerak'),
  password: z.string().min(6, 'Parol kamida 6 ta belgi bo\'lishi kerak'),
  role: z.enum(['ADMIN', 'BOSHLIQ', 'SOTUVCHI', 'OMBORCHI'], {
    errorMap: () => ({ message: 'Rol tanlanishi shart' }),
  }),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const roleOptions = [
  { value: 'ADMIN', label: 'Administrator' },
  { value: 'BOSHLIQ', label: 'Boshliq' },
  { value: 'SOTUVCHI', label: 'Sotuvchi' },
  { value: 'OMBORCHI', label: 'Omborchi' },
];

export default function AdminUsersPage() {
  const { locale } = useParams();
  const { data: session } = useSession();
  const { toasts, addToast, removeToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('/api/users')
      .then((r) => r.json())
      .then((data) => {
        // O'zimni olib tashlash
        const filteredUsers = data.filter((u: User) => u.id !== parseInt(session?.user?.id || '0'));
        setUsers(filteredUsers);
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/users/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== deleteId));
        addToast('Foydalanuvchi o\'chirildi', 'success');
      } else {
        addToast('Xatolik yuz berdi', 'error');
      }
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        addToast('Foydalanuvchi muvaffaqiyatli qo\'shildi', 'success');
        setShowAddModal(false);
        reset();
        fetchUsers();
      } else {
        const err = await res.json();
        addToast(err.error || 'Xatolik yuz berdi', 'error');
      }
    } catch {
      addToast('Xatolik yuz berdi', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleVariant = (role: string): 'danger' | 'warning' | 'success' | 'info' => {
    const map: Record<string, 'danger' | 'warning' | 'success' | 'info'> = {
      ADMIN: 'danger', BOSHLIQ: 'warning', SOTUVCHI: 'success', OMBORCHI: 'info',
    };
    return map[role] ?? 'info';
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Xodimlar ro\'yxati', new Date().toLocaleDateString('uz-UZ')],
      [''],
      ['#', 'To\'liq ism', 'Login', 'Rol', 'Telefon', 'Qo\'shilgan'],
      ...users.map((u, i) => [
        (i + 1).toString(),
        u.fullName,
        u.login,
        getRoleName(u.role),
        u.phone || '—',
        formatDate(u.createdAt),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `xodimlar_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Xodimlar ro'yxati</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #1f2937; margin-bottom: 10px; }
          .date { color: #6b7280; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
          th { background-color: #f3f4f6; font-weight: 600; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
          .badge-danger { background-color: #fee2e2; color: #991b1b; }
          .badge-warning { background-color: #fef3c7; color: #92400e; }
          .badge-success { background-color: #d1fae5; color: #065f46; }
          .badge-info { background-color: #dbeafe; color: #1e40af; }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <h1>Xodimlar ro'yxati</h1>
        <div class="date">${new Date().toLocaleDateString('uz-UZ')}</div>
        
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>To'liq ism</th>
              <th>Login</th>
              <th>Rol</th>
              <th>Telefon</th>
              <th>Qo'shilgan</th>
            </tr>
          </thead>
          <tbody>
            ${users.map((u, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${u.fullName}</td>
                <td>${u.login}</td>
                <td><span class="badge badge-${roleVariant(u.role)}">${getRoleName(u.role)}</span></td>
                <td>${u.phone || '—'}</td>
                <td>${formatDate(u.createdAt)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <script>
          window.onload = () => {
            window.print();
            setTimeout(() => window.close(), 100);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Xodimlar boshqaruvi</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={exportToCSV} className="flex items-center gap-2">
            <Download size={16} />
            Excel
          </Button>
          <Button variant="outline" size="sm" onClick={exportToPDF} className="flex items-center gap-2">
            <FileText size={16} />
            PDF
          </Button>
          <Button className="flex items-center gap-2" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Yangi xodim
          </Button>
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
                <Th>To'liq ism</Th>
                <Th>Login</Th>
                <Th>Rol</Th>
                <Th>Telefon</Th>
                <Th>Qo'shilgan</Th>
                <Th>Amallar</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user, i) => (
                <Tr key={user.id}>
                  <Td className="text-gray-500">{i + 1}</Td>
                  <Td className="font-medium">{user.fullName}</Td>
                  <Td className="text-gray-500">{user.login}</Td>
                  <Td><Badge variant={roleVariant(user.role)}>{getRoleName(user.role)}</Badge></Td>
                  <Td className="text-gray-500">{user.phone || '—'}</Td>
                  <Td className="text-gray-500">{formatDate(user.createdAt)}</Td>
                  <Td>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => setDeleteId(user.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      )}

      {/* Add User Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Yangi xodim qo'shish" size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="To'liq ism"
            placeholder="Abdullayev Abdulla"
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Login"
              placeholder="abdulla01"
              error={errors.login?.message}
              {...register('login')}
            />
            <Input
              label="Parol"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>

          <Select
            label="Rol"
            options={roleOptions}
            placeholder="Rol tanlang..."
            error={errors.role?.message}
            {...register('role')}
          />

          <Input
            label="Telefon raqam (ixtiyoriy)"
            placeholder="+998901234567"
            {...register('phone')}
          />

          <Input
            label="Manzil (ixtiyoriy)"
            placeholder="Toshkent, O'zbekiston"
            {...register('address')}
          />

          <div className="flex gap-3 pt-2">
            <Button type="submit" isLoading={isSubmitting}>Saqlash</Button>
            <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>Bekor qilish</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Xodimni o'chirish">
        <p className="text-gray-700 mb-6">Haqiqatan ham bu xodimni o'chirmoqchimisiz?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Bekor qilish</Button>
          <Button variant="danger" isLoading={deleting} onClick={handleDelete}>O'chirish</Button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
