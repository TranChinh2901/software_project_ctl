'use client';

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Chào mừng đến với SoftwareShop
        </h1>
        <p className="text-xl mb-8">
          Khám phá những sản phẩm công nghệ tốt nhất với giá cả hợp lý
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
          Mua ngay
        </button>
      </div>
    </section>
  );
}
