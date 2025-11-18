'use client';

export default function DashboardStats() {
  const stats = [
    { label: 'Tổng doanh thu', value: '150,000,000 ₫', change: '+12%', color: 'blue' },
    { label: 'Đơn hàng', value: '1,234', change: '+5%', color: 'green' },
    { label: 'Sản phẩm', value: '456', change: '+2%', color: 'purple' },
    { label: 'Người dùng', value: '8,910', change: '+8%', color: 'orange' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            <p className={`ml-2 text-sm font-medium text-${stat.color}-600`}>
              {stat.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
