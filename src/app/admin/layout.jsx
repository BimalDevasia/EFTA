"use client";

import Wrapper from "@/components/Wrapper";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { AuthProvider, useAuth } from "@/lib/auth";

const AdminLayout = ({ children }) => {
  return (
    <AuthProvider>
      <AuthGuard>
        <Wrapper>
          <div className="flex h-screen overflow-hidden">
            <div className="flex-shrink-0 w-[232px]">
              <Sidebar />
            </div>
            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </div>
        </Wrapper>
      </AuthGuard>
    </AuthProvider>
  );
};

const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, router, pathname]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8300FF]"></div>
      </div>
    );
  }

  // If not authenticated and not on login page, don't render children
  if (!isAuthenticated && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Redirecting to login...</div>
      </div>
    );
  }

  return children;
};

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <div className="flex flex-col justify-between border-r border-gray-200 h-full pt-56 pl-4 pb-24 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <nav>
          <ul className="space-y-6">
            <li>
              <Link
                className={cn(
                  "text-[20px] text-[#00000063] font-bold",
                  pathname === "/admin/orders" && "text-[#8300FF]"
                )}
                href="/admin/orders"
              >
                Orders
              </Link>
            </li>
            <li>
              <button
                className={cn(
                  "text-[20px] text-[#00000063] font-bold",
                  pathname.startsWith("/admin/product") && "text-[#8300FF]"
                )}
                href="/admin/products"
              >
                Products
              </button>
              <div className="pl-4 flex flex-col gap-1 py-5 space-y-4">
                <Link
                  className={cn(
                    "text-[#00000063] font-semibold",
                    pathname === "/admin/product/gift" && "text-[#8300FF]"
                  )}
                  href="/admin/product/gift"
                >
                  Gift
                </Link>
                <Link
                  className={cn(
                    "text-[#00000063] font-semibold",
                    pathname === "/admin/product/bundle" && "text-[#8300FF]"
                  )}
                  href="/admin/product/bundle"
                >
                  Bundle
                </Link>
                <Link
                  className={cn(
                    "text-[#00000063] font-semibold",
                    pathname === "/admin/product/cake" && "text-[#8300FF]"
                  )}
                  href="/admin/product/cake"
                >
                  Cake
                </Link>
              </div>
            </li>
            <li>
              <Link
                className={cn(
                  "text-[20px] text-[#00000063] font-bold",
                  pathname === "/admin/banners" && "text-[#8300FF]"
                )}
                href="/admin/banners"
              >
                Banners
              </Link>
            </li>
            <li>
              <Link
                className={cn(
                  "text-[20px] text-[#00000063] font-bold",
                  pathname === "/admin/testimonies" && "text-[#8300FF]"
                )}
                href="/admin/testimonies"
              >
                Testimonies
              </Link>
            </li>
            <li>
              <Link
                className={cn(
                  "text-[20px] text-[#00000063] font-bold",
                  pathname === "/admin/admins" && "text-[#8300FF]"
                )}
                href="/admin/admins"
              >
                Admin Management
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex-shrink-0 space-y-4">
        {user && (
          <div className="pl-4 text-sm text-gray-600">
            <p>Logged in as:</p>
            <p className="font-medium">{user.name}</p>
          </div>
        )}
        <button 
          onClick={handleLogout}
          className="bg-[#FAFAFA] text-[#8300FF] font-bold text-[20px] pl-4 py-4 w-full inline-flex justify-start hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminLayout;
