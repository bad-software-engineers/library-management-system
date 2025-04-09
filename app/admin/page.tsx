import { checkRole } from "@/utils/roles";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const isAdmin = await checkRole("admin");
  if (!isAdmin) {
    redirect("/");
  }
  return(
    // <ImageUpload/>
    <div className="bg-white my-5 p-2 ">
      <h1>Admin Dashboard</h1>
    </div>
  );
}
