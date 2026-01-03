import OrderConfirm from '@/page-components/Main/OrderConfirm/OrderConfirm';

export const metadata = {
  title: 'Order Confirmation - Alidaad',
};

export default function OrderConfirmPage({ params }) {
  return <OrderConfirm params={params} />;
}
