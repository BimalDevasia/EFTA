"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminProducts from "@/components/AdminProducts";

const ProductDataPage = ({ params }) => {
  const categoryId = params?.categoryId || 'gift';
  const router = useRouter();
  
  // No redirect logic; allow all categories to render
  
  return (
    <div className="pt-40 pb-10 px-6">
      <AdminProducts categoryId={categoryId} />
    </div>
  );
};

export default ProductDataPage;
