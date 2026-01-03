import { Suspense } from 'react';
import Search from '@/page-components/Main/Search/Search';
import Loading from '@/components/Shared/Loading/Loading';

export const metadata = {
  title: 'Search - Alidaad',
};

export default function SearchPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Search />
    </Suspense>
  );
}
