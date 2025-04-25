// app/admin/dashboard.tsx
import { checkRole } from "@/utils/roles";
import { redirect } from "next/navigation";
import { UsersIcon } from "@heroicons/react/24/solid";
import { getUserCount } from "@/db/crud/users.crud";

export default async function AdminDashboard() {
  const isAdmin = await checkRole("admin");
  if (!isAdmin) {
    redirect("/");
  }

  const userCount = getUserCount();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Total Users Card */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center gap-4">
            <UsersIcon className="w-12 h-12 text-white" />
            <div>
              <h2 className="text-2xl font-semibold">Total Users</h2>
              <p className="text-4xl font-bold">{userCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
