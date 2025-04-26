import Sidebar from "@/components/admin/Sidebar";
import "../globals.css";
import Header from "@/components/admin/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: '%s | Admin Dashboard | Library Management System',
    default: 'Admin Dashboard | Library Management System',
  },
  description: "Manage everything from here if you are admin",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-indigo-100/75">
        <main className="flex">
          <Sidebar />
          <div className="flex flex-col  p-4 w-full">
            <Header />
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
