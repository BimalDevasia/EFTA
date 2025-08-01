import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default function AdminPage() {
  // Check for admin authentication token (adjust key as needed)
  const token = cookies().get("admin_token")?.value;

  // If not logged in, redirect to login page
  if (!token) {
    redirect("/admin/login");
    return null;
  }

  // If logged in, redirect to orders section (or render dashboard)
  redirect("/admin/orders");
  return null;
}
