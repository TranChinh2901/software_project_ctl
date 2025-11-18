'use client';

export default function Categories() {
  const categories = [
    { name: 'Laptop', icon: '💻', count: 150 },
    { name: 'Điện thoại', icon: '📱', count: 200 },
    { name: 'Tablet', icon: '📱', count: 80 },
    { name: 'Phụ kiện', icon: '🎧', count: 300 },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Danh mục sản phẩm</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition cursor-pointer"
            >
              <div className="text-5xl mb-4">{category.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
              <p className="text-gray-500">{category.count} sản phẩm</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
