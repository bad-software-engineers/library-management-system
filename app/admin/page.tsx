import { checkRole } from "@/utils/roles";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const isAdmin = await checkRole("admin");
  if (!isAdmin) {
    redirect("/");
  }
  return(
    // <ImageUpload/>
    <div className="text-2xl font-bold mb-6 p-6">
      <h1>Admin Dashboard</h1>
    </div>
  );
}
