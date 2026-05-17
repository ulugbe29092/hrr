import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount) + ' so\'m';
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  const messageDate = new Date(date);
  const now = new Date();
  
  // Bugungi sana
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDate = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
  
  const diffTime = msgDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  // Bugun - faqat soat
  if (diffDays === 0) {
    return messageDate.toLocaleTimeString('uz-UZ', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  // Kecha
  if (diffDays === -1) {
    return 'Kecha';
  }
  
  // Ertaga
  if (diffDays === 1) {
    return 'Ertaga';
  }
  
  // Boshqa kunlar - sana
  return messageDate.toLocaleDateString('uz-UZ', {
    day: 'numeric',
    month: 'short',
  });
}

export function getRoleName(role: string): string {
  const roles: Record<string, string> = {
    ADMIN: 'Administrator',
    BOSHLIQ: 'Boshliq',
    SOTUVCHI: 'Sotuvchi',
    OMBORCHI: 'Omborchi',
  };
  return roles[role] || role;
}
