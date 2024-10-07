import Footer from "@/components/Footer";
import React from "react";

const WithFooterLayout = ({ children }) => {
  return (
    <>
      {children}
      <Footer />
    </>
  );
};

export default WithFooterLayout;
