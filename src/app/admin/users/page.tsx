import Users from "@/components/admin/users/Users";

export default function AdminUsersPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Quản lý người dùng</h2>
        <Users/>
      </div>
      
    </div>
  );
}
