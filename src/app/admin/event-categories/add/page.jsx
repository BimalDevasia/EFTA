import React from "react";
import AdminEventCategories from "@/components/AdminEventCategories";

const AddEventCategoryPage = () => {
  return (
    <div className="pt-40 pb-10 px-6 h-screen">
      <AdminEventCategories mode="add" />
    </div>
  );
};

export default AddEventCategoryPage;
