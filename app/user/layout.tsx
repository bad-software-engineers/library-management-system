import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/user/Header";
import Sidebar from "@/components/user/Sidebar";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: {
    template: '%s | User Dashboard | Library Management System',
    default: 'User Dashboard | Library Management System',
  },
  description: "View your library information and transactions",
};

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-indigo-100/75">
          <main className="flex">
            <Sidebar />
            <div className="flex flex-col p-4 w-full">
              <Header />
              {children}
            </div>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
} 