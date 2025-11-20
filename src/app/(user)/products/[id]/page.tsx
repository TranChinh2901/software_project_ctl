import ProductDetail from '@/components/user/products/ProductDetail';
import RelatedProducts from '@/components/user/products/RelatedProducts';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetail productId={params.id} />
      <RelatedProducts productId={params.id} />
    </div>
  );
}
