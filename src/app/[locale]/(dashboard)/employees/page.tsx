'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { getRoleName, formatDate } from '@/lib/utils';

interface Employee {
  id: number;
  fullName: string;
  login: string;
  role: string;
  phone?: string;
  address?: string;
  avatar?: string;
  createdAt: string;
}

export default function EmployeesPage() {
  const t = useTranslations('employees');
  const { locale } = useParams();
  const { data: session } = useSession();
  const { toasts, addToast, removeToast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isAdmin = session?.user?.role === 'ADMIN';

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        // Exclude current user (admin) from employees list
        const filtered = data.filter((u: Employee) => u.id !== parseInt(session?.user?.id || '0'));
        setEmployees(filtered);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/users/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setEmployees((prev) => prev.filter((e) => e.id !== deleteId));
        addToast('Xodim o\'chirildi', 'success');
      } else {
        addToast('Xatolik yuz berdi', 'error');
      }
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const roleVariant = (role: string) => {
    const map: Record<string, 'info' | 'danger' | 'success' | 'warning'> = {
      ADMIN: 'danger',
      BOSHLIQ: 'warning',
      SOTUVCHI: 'success',
      OMBORCHI: 'info',
    };
    return map[role] ?? 'default';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        {isAdmin && (
          <Link href={`/${locale}/admin/users/add`}>
            <Button className="flex items-center gap-2">
              <Plus size={18} /> {t('addEmployee')}
            </Button>
          </Link>
        )}
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
                <Th>{t('fullName')}</Th>
                {isAdmin && <Th>Login</Th>}
                <Th>{t('role')}</Th>
                {isAdmin && <Th>{t('phone')}</Th>}
                <Th>Kirim</Th>
                <Th>Chiqim</Th>
                {isAdmin && <Th>Qo'shilgan</Th>}
                <Th>Amallar</Th>
              </Tr>
            </Thead>
            <Tbody>
              {employees.length === 0 ? (
                <Tr>
                  <Td colSpan={isAdmin ? 9 : 6} className="text-center text-gray-500 py-8">
                    Xodim topilmadi
                  </Td>
                </Tr>
              ) : (
                employees.map((emp: any, i) => (
                  <Tr key={emp.id}>
                    <Td className="text-gray-500">{i + 1}</Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        {emp.avatar ? (
                          <img src={emp.avatar} alt={emp.fullName} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                            {emp.fullName[0]}
                          </div>
                        )}
                        <span className="font-medium">{emp.fullName}</span>
                      </div>
                    </Td>
                    {isAdmin && <Td className="text-gray-500">{emp.login}</Td>}
                    <Td>
                      <Badge variant={roleVariant(emp.role)}>{getRoleName(emp.role)}</Badge>
                    </Td>
                    {isAdmin && <Td className="text-gray-500">{emp.phone || '—'}</Td>}
                    <Td>
                      <Badge variant="success">{emp.totalIncome || 0} ta</Badge>
                    </Td>
                    <Td>
                      <Badge variant="warning">{emp.totalExpense || 0} ta</Badge>
                    </Td>
                    {isAdmin && <Td className="text-gray-500">{formatDate(emp.createdAt)}</Td>}
                    <Td>
                      <div className="flex items-center gap-1">
                        <Link href={`/${locale}/employees/${emp.id}`}>
                          <Button variant="ghost" size="sm"><Eye size={16} /></Button>
                        </Link>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => setDeleteId(emp.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </div>
      )}

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Xodimni o'chirish">
        <p className="text-gray-700 mb-6">Haqiqatan ham bu xodimni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Bekor qilish</Button>
          <Button variant="danger" isLoading={deleting} onClick={handleDelete}>O'chirish</Button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
