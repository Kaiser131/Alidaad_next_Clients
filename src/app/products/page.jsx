import { Suspense } from 'react';
import Products from '@/page-components/Main/Products/Products';
import Loading from '@/components/Shared/Loading/Loading';

export const metadata = {
  title: 'Products - Alidaad',
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Products />
    </Suspense>
  );
}
