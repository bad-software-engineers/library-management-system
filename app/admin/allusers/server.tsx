// app/admin/allusers/server.tsx
"use server";

import { clerkClient } from "@clerk/nextjs/server";

export async function fetchUsers() {
  const client = await clerkClient();
  const { data: users } = await client.users.getUserList();

  // Convert complex user objects into plain objects
  const simplifiedUsers = users.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.emailAddresses?.[0]?.emailAddress || "",
    role: user.publicMetadata?.role || "user",
    imageUrl: user.imageUrl || "",
  }));

  return simplifiedUsers;
}

export async function changeRole(userId: string, newRole: string) {
  const client = await clerkClient();
  await client.users.updateUser(userId, {
    publicMetadata: { role: newRole },
  });
}
