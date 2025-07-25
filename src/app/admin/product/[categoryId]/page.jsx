"use client";
import React from "react";
import AdminProducts from "@/components/AdminProducts";

const ProductDataPage = ({ params }) => {
  const categoryId = params?.categoryId || 'gift';
  
  return (
    <div className="pt-40 pb-10 px-6">
      <AdminProducts category={categoryId} />
    </div>
  );
};

export default ProductDataPage;
