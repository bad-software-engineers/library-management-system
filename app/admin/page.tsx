// app/admin/dashboard.tsx
import { checkRole } from "@/utils/roles";
import { redirect } from "next/navigation";
import { clerkClient } from '@clerk/nextjs/server';
import { UserIcon, UsersIcon } from "@heroicons/react/24/solid";

export default async function AdminDashboard() {
  const isAdmin = await checkRole("admin");
  if (!isAdmin) {
    redirect("/");
  }

  // Fetch total number of users from Clerk's API
  const client = await clerkClient();
  const users = await client.users.getUserList();
  const userCount = users.data.length;

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

        {/* Other Stats Can Be Added Below */}
        {/* Example Card: */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center gap-4">
            <UserIcon className="w-12 h-12 text-white" />
            <div>
              <h2 className="text-2xl font-semibold">New Sign-ups</h2>
              <p className="text-4xl font-bold">XX</p> {/* Example number */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
