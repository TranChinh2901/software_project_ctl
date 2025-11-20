
import AddProductButton from '@/components/admin/products/AddProductButton';

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Quản lý sản phẩm</h2>
        <AddProductButton />
      </div>

    </div>
  );
}
