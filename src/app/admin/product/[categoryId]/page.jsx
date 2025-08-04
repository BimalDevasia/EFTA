"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminProducts from "@/components/AdminProducts";

const ProductDataPage = ({ params }) => {
  const categoryId = params?.categoryId;
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only redirect if categoryId is present and not valid
    if (categoryId && categoryId !== 'gift' && categoryId !== 'corporate') {
      router.push('/admin/product/gift');
    } else {
      setLoading(false);
    }
  }, [categoryId, router]);

  // Render a loading state if categoryId is not yet available from the router
  // or if we're still determining if we need to redirect
  if (loading || !categoryId) {
    return (
      <div className="pt-40 pb-10 px-6">
        <p>Loading...</p>
      </div>
    );
  }

  // Render for valid categories, or a message for invalid ones while redirecting
  if (categoryId === 'gift' || categoryId === 'corporate') {
    console.log(`Rendering admin products for category: ${categoryId}`);
    return (
      <div className="pt-40 pb-10 px-6">
        <AdminProducts categoryId={categoryId} hideHeading={false} />
      </div>
    );
  } else {
    return (
      <div className="pt-40 pb-10 px-6">
        <p>Invalid category. Redirecting...</p>
      </div>
    );
  }
};

export default ProductDataPage;
