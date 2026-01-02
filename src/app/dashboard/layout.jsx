'use client';

import Dashboard from '@/Layout/Dashboard/Dashboard';
import AdminRoute from '@/Routes/AdminRoute';

export default function DashboardLayout({ children }) {
  return (
    <AdminRoute>
      <Dashboard>
        {children}
      </Dashboard>
    </AdminRoute>
  );
}
