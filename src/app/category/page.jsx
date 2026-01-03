import { Suspense } from 'react';
import Category from '@/page-components/Main/Category/Category';
import Loading from '@/components/Shared/Loading/Loading';

export const metadata = {
  title: 'Category - Alidaad',
};

export default function CategoryPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Category />
    </Suspense>
  );
}
