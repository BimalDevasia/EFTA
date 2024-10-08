"use client";

import Wrapper from "@/components/Wrapper";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const AdminLayout = ({ children }) => {
  return (
    <Wrapper>
      <div className="grid grid-cols-[232px_auto]">
        <div>
          <Sidebar />
        </div>
        <div>{children}</div>
      </div>
    </Wrapper>
  );
};

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="flex flex-col justify-between border-r border-gray-200 h-screen pt-56 pl-4 pb-24">
      <div>
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
          </ul>
        </nav>
      </div>
      <div>
        <button className="bg-[#FAFAFA] text-[#8300FF] font-bold text-[20px] pl-4 py-4 w-full inline-flex justify-start">
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminLayout;
