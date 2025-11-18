'use client';

interface RelatedProductsProps {
  productId: string;
}

export default function RelatedProducts({ productId }: RelatedProductsProps) {
  const products = [
    { id: 1, name: 'MacBook Air M2', price: '28,000,000 ₫', image: '💻' },
    { id: 2, name: 'iPad Pro', price: '25,000,000 ₫', image: '📱' },
    { id: 3, name: 'Magic Keyboard', price: '8,000,000 ₫', image: '⌨️' },
  ];

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <p className="text-blue-600 font-bold">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
