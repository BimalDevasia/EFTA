import React from "react";
import AdminEventCategories from "@/components/AdminEventCategories";

const EditEventCategoryPage = () => {
  return (
    <div className="pt-40 pb-10 px-6 h-screen">
      <AdminEventCategories mode="edit" />
    </div>
  );
};

export default EditEventCategoryPage;
