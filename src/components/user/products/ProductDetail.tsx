'use client';

interface ProductDetailProps {
  productId: string;
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-gray-100 h-96 flex items-center justify-center text-9xl rounded">
          💻
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">MacBook Pro M3</h1>
          <div className="text-3xl text-blue-600 font-bold mb-6">45,000,000 ₫</div>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Mô tả</h3>
            <p className="text-gray-600">
              MacBook Pro với chip M3 mạnh mẽ, màn hình Retina tuyệt đẹp, 
              thời lượng pin ấn tượng. Lý tưởng cho công việc và sáng tạo.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Thông số kỹ thuật</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Chip M3</li>
              <li>• RAM 16GB</li>
              <li>• SSD 512GB</li>
              <li>• Màn hình 14 inch</li>
            </ul>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <label>Số lượng:</label>
            <input
              type="number"
              min="1"
              defaultValue="1"
              className="border rounded px-3 py-2 w-20"
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}
