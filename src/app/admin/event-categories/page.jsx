import React from "react";
import AdminEventCategories from "@/components/AdminEventCategories";

const EventCategoriesPage = () => {
  return (
    <div className="pt-40 pb-10 px-6">
      <AdminEventCategories mode="list" />
    </div>
  );
};

export default EventCategoriesPage;
