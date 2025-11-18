'use client';

export default function AdminHeader() {
  return (
    <header className="bg-white shadow-md p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Quản trị hệ thống</h1>
        <div className="flex items-center space-x-4">
          <button className="text-gray-700 hover:text-blue-600">
            🔔
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
              A
            </div>
            <span>Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
