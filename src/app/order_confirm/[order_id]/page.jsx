import OrderConfirm from '@/Pages/Main/OrderConfirm/OrderConfirm';

export const metadata = {
  title: 'Order Confirmation - Alidaad',
};

export default function OrderConfirmPage({ params }) {
  return <OrderConfirm params={params} />;
}
