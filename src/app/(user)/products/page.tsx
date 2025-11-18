import ProductList from '@/components/products/ProductList';
import ProductFilter from '@/components/products/ProductFilter';

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sản phẩm</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1">
          <ProductFilter />
        </aside>
        <div className="md:col-span-3">
          <ProductList />
        </div>
      </div>
    </div>
  );
}
