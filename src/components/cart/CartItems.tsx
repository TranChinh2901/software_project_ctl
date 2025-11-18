'use client';

export default function CartItems() {
  const items = [
    { id: 1, name: 'MacBook Pro M3', price: 45000000, quantity: 1, image: '💻' },
    { id: 2, name: 'iPhone 15 Pro', price: 28000000, quantity: 2, image: '📱' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Sản phẩm trong giỏ</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
            <div className="w-20 h-20 bg-gray-100 flex items-center justify-center text-3xl rounded">
              {item.image}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-blue-600">{item.price.toLocaleString('vi-VN')} ₫</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-2 py-1 border rounded">-</button>
              <span className="px-4">{item.quantity}</span>
              <button className="px-2 py-1 border rounded">+</button>
            </div>
            <button className="text-red-600 hover:text-red-800">Xóa</button>
          </div>
        ))}
      </div>
    </div>
  );
}
