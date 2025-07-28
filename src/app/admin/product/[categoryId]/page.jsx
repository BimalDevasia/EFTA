"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminProducts from "@/components/AdminProducts";

const ProductDataPage = ({ params }) => {
  const categoryId = params?.categoryId || 'gift';
  const router = useRouter();
  
  useEffect(() => {
    // Redirect non-gift categories to gift since we only support personalized gifts in admin
    if (categoryId !== 'gift') {
      router.replace('/admin/product/gift');
    }
  }, [categoryId, router]);
  
  // Only render if category is gift
  if (categoryId !== 'gift') {
    return null;
  }
  
  return (
    <div className="pt-40 pb-10 px-6">
      <AdminProducts category={categoryId} />
    </div>
  );
};

export default ProductDataPage;
