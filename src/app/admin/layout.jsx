import AdminSidebar from "@/components/AdminSidebar";
import Wrapper from "@/components/Wrapper";
import { getAuth } from "@/lib/session";
import { redirect } from "next/navigation";
import React from "react";

const AdminLayout = async ({ children }) => {
  const auth = await getAuth();
  if (!auth.user) {
    return redirect("/api/login/google");
  }

  return (
    <Wrapper>
      <div className="grid grid-cols-[232px_auto]">
        <div>
          <AdminSidebar />
        </div>

        <div>{children}</div>
      </div>
    </Wrapper>
  );
};

export default AdminLayout;
