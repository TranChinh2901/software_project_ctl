'use client';

export default function ProductList() {
  const products = [
    { id: 1, name: 'MacBook Pro M3', price: '45,000,000 ₫', image: '💻' },
    { id: 2, name: 'iPhone 15 Pro', price: '28,000,000 ₫', image: '📱' },
    { id: 3, name: 'iPad Air', price: '15,000,000 ₫', image: '📱' },
    { id: 4, name: 'AirPods Pro', price: '6,000,000 ₫', image: '🎧' },
    { id: 5, name: 'Dell XPS 15', price: '35,000,000 ₫', image: '💻' },
    { id: 6, name: 'Samsung Galaxy S24', price: '20,000,000 ₫', image: '📱' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
        >
          <div className="h-48 bg-gray-100 flex items-center justify-center text-6xl">
            {product.image}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-blue-600 font-bold text-xl mb-4">{product.price}</p>
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Thêm vào giỏ
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
