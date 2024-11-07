import { redirect } from "next/navigation";

const Adminpage = async () => {
  redirect("/admin/product/category");
};

export default Adminpage;
