'use client';

import Account from '@/Pages/Main/Account/Account';
import PrivateRoute from '@/Routes/PrivateRoute';

export default function AccountPage() {
  return (
    <PrivateRoute>
      <Account />
    </PrivateRoute>
  );
}
