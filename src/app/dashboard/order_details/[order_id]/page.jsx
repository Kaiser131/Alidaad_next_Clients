export const dynamic = 'force-dynamic';

import OrderDetails from '@/page-components/Dashboard/Orders/OrderDetails';

export default function OrderDetailsPage({ params }) {
  return <OrderDetails params={params} />;
}
