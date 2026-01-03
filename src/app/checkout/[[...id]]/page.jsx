import Checkout from '@/page-components/Main/Checkout/Checkout';

export const metadata = {
  title: 'Checkout - Alidaad',
};

export default function CheckoutPage({ params }) {
  return <Checkout params={params} />;
}
