'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
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

export default function AdminUsersPage() {
  const { locale } = useParams();
  const { toasts, addToast, removeToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

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

  const roleVariant = (role: string): 'danger' | 'warning' | 'success' | 'info' => {
    const map: Record<string, 'danger' | 'warning' | 'success' | 'info'> = {
      ADMIN: 'danger', BOSHLIQ: 'warning', SOTUVCHI: 'success', OMBORCHI: 'info',
    };
    return map[role] ?? 'info';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Foydalanuvchilar boshqaruvi</h1>
        <Link href={`/${locale}/admin/users/add`}>
          <Button className="flex items-center gap-2">
            <Plus size={18} /> Yangi foydalanuvchi
          </Button>
        </Link>
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
                      <Link href={`/${locale}/admin/users/${user.id}/edit`}>
                        <Button variant="ghost" size="sm"><Edit size={16} /></Button>
                      </Link>
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
        </motion.div>
      )}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Foydalanuvchini o'chirish">
        <p className="text-gray-700 mb-6">Haqiqatan ham bu foydalanuvchini o'chirmoqchimisiz?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Bekor qilish</Button>
          <Button variant="danger" isLoading={deleting} onClick={handleDelete}>O'chirish</Button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
