// app/admin/account-requests/AccountRequestsClient.tsx (Client-side component)

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableRow, TableCell, TableBody, TableHeader, TableHead} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { acceptUser, getVerifyPendingWithClerk, rejectUser } from "./server";

const AccountRequestsClient = () => {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [dialogType, setDialogType] = useState<'accept' | 'reject' | null>(null);

  const loadData = async () => {
    const data = await getVerifyPendingWithClerk();
    setPendingUsers(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle accepting or rejecting a user
  const handleConfirm = async () => {
    if (!selectedUser) return;

    if (dialogType === "accept") {
      await acceptUser(selectedUser.clerkId, selectedUser.email);
    } else if (dialogType === "reject") {
      await rejectUser(selectedUser.clerkId);
    }

    setSelectedUser(null);
    setDialogType(null);
    
    loadData();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Account Requests</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Profile</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {pendingUsers.length > 0 ? (
            pendingUsers.map((user) => (
              <TableRow key={user.clerkId}>
                <TableCell>
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="flex gap-2">
                  {/* Accept Button */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => {
                          setSelectedUser(user);
                          setDialogType('accept');
                        }}
                      >
                        Accept
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Accept this user?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to approve <strong>{user.email}</strong>?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleConfirm()}>
                          Yes, Accept
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  {/* Reject Button */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="bg-red-500 hover:bg-red-600"
                        variant="destructive"
                        onClick={() => {
                          setSelectedUser(user);
                          setDialogType('reject');
                        }}
                      >
                        Reject
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reject this user?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to reject <strong>{user.email}</strong>? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleConfirm()}>
                          Yes, Reject
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500">
                No pending requests.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AccountRequestsClient;
