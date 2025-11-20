'use client';

export default function CartSummary() {
  const subtotal = 101000000;
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Tổng đơn hàng</h2>
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span>Tạm tính:</span>
          <span>{subtotal.toLocaleString('vi-VN')} ₫</span>
        </div>
        <div className="flex justify-between">
          <span>Phí vận chuyển:</span>
          {/* <span>{shipping === 0 ? 'Miễn phí' : `${shipping.toLocaleString('vi-VN')} ₫`}</span> */}
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between text-xl font-bold">
            <span>Tổng cộng:</span>
            <span className="text-blue-600">{total.toLocaleString('vi-VN')} ₫</span>
          </div>
        </div>
      </div>
      <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold">
        Tiến hành thanh toán
      </button>
      <button className="w-full mt-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50">
        Tiếp tục mua hàng
      </button>
    </div>
  );
}
