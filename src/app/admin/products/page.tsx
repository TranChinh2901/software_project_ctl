import ProductTable from '@/components/admin/products/ProductTable';
import AddProductButton from '@/components/admin/products/AddProductButton';

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
        <AddProductButton />
      </div>
      <ProductTable />
    </div>
  );
}
