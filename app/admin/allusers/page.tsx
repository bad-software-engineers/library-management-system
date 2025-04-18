// app/admin/allusers/page.tsx
"use client";

import { useState, useEffect } from "react";
import { fetchUsers, changeRole } from "./server";  // import server-side logic
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [users, setUsers] = useState<any[]>([]);

  // Function to fetch users
  const getUsers = async () => {
    const fetchedUsers = await fetchUsers();  // Call the server function
    setUsers(fetchedUsers);  // Update the state with fetched data
  };

  // Fetch users on component mount
  useEffect(() => {
    getUsers();
  }, []);  // Empty dependency array means it runs only once when the component mounts

  // Handle role change and refetch updated users
  const handleRoleChange = async (userId: string, newRole: string) => {
    await changeRole(userId, newRole);  // Call the server function to change role
    getUsers();  // Refetch the users after role change
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">All Users</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Profile</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => {
            const role = user.role || "user";

            return (
              <TableRow key={user.id}>
                <TableCell>
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell>{user.firstName || "-"}</TableCell>
                <TableCell>{user.lastName || "-"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="capitalize flex items-center gap-2 min-w-[80px]">
                        {String(role)}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {["user", "admin"].map((r) => (
                        <form action={changeRole.bind(null, user.id, r)} key={r}>
                          <DropdownMenuItem asChild>
                          <button
                            type="submit"
                            className={`w-full text-left ${
                              r === role ? "font-semibold text-blue-500" : ""
                            }`}
                          >
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                          </button>
                        </DropdownMenuItem>
                        </form>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
