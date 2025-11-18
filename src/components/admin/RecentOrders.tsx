'use client';

export default function RecentOrders() {
  const orders = [
    { id: 'ORD001', customer: 'Nguyễn Văn A', total: '2,500,000 ₫', status: 'Đã giao' },
    { id: 'ORD002', customer: 'Trần Thị B', total: '1,800,000 ₫', status: 'Đang xử lý' },
    { id: 'ORD003', customer: 'Lê Văn C', total: '3,200,000 ₫', status: 'Đang giao' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Đơn hàng gần đây</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Mã đơn</th>
              <th className="text-left py-2">Khách hàng</th>
              <th className="text-left py-2">Tổng tiền</th>
              <th className="text-left py-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="py-2">{order.id}</td>
                <td className="py-2">{order.customer}</td>
                <td className="py-2">{order.total}</td>
                <td className="py-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
