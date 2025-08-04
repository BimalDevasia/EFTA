"use client";
import React, { useEffect } from "react";
import AdminProducts from "@/components/AdminProducts";

export default function CorporateProductPage() {
  return (
    <div className="pt-40 pb-10 px-6">
      <AdminProducts categoryId="corporate" hideHeading={false} />
    </div>
  );
}
