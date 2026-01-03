'use client';

import Account from '@/page-components/Main/Account/Account';
import PrivateRoute from '@/Routes/PrivateRoute';

export default function AccountPage() {
  return (
    <PrivateRoute>
      <Account />
    </PrivateRoute>
  );
}
