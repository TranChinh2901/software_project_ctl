'use client';

export default function ProductTable() {
  const products = [
    { id: 1, name: 'MacBook Pro M3', price: '45,000,000 ₫', stock: 15, category: 'Laptop' },
    { id: 2, name: 'iPhone 15 Pro', price: '28,000,000 ₫', stock: 25, category: 'Điện thoại' },
    { id: 3, name: 'iPad Air', price: '15,000,000 ₫', stock: 30, category: 'Tablet' },
  ];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên sản phẩm</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tồn kho</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4">{product.id}</td>
              <td className="px-6 py-4">{product.name}</td>
              <td className="px-6 py-4">{product.price}</td>
              <td className="px-6 py-4">{product.stock}</td>
              <td className="px-6 py-4">{product.category}</td>
              <td className="px-6 py-4">
                <button className="text-blue-600 hover:text-blue-800 mr-3">Sửa</button>
                <button className="text-red-600 hover:text-red-800">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
