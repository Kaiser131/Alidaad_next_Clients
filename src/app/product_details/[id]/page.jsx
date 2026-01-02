import ProductDetails from '@/components/Shared/Product/ProductDetails';

export const metadata = {
  title: 'Product Details - Alidaad',
};

export default function ProductDetailsPage({ params }) {
  return <ProductDetails params={params} />;
}
