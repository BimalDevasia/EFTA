// "use client";

// import Breadcrumb from "@/components/Breadcrumb";
// import { CardCarousal } from "@/components/NormalCardCarousal";
// import Wrapper from "@/components/Wrapper";
// import { cn } from "@/lib/utils";
// import { ChevronDown } from "lucide-react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import React from "react";

// const ProductListPage = () => {
//   return (
//     <Wrapper className="pt-32 pb-12">
//       <div className="grid grid-cols-[232px_auto] gap-5">
//         <Sidebar />
//         <div className="space-y-12">
//           <Breadcrumb
//             links={[
//               { name: "Gifts", href: "/products" },
//               { name: "Valentine's Day", href: "/products/valentines" },
//             ]}
//           />
//           <div className="grid grid-cols-3 gap-x-2.5 gap-y-10">
//             {Array.from({ length: 6 }).map((_, index) => (
//               <CardCarousal
//                 key={index}
//                 name="Photo Printed Mug"
//                 desc="Photo Printed Mug"
//                 price={100}
//                 discountedPrice={80}
//                 isCustom={index === 0}
//               />
//             ))}
//           </div>
//           <div className="flex justify-center">
//             <button className="text-[16px] font-bold text-[#00000087] inline-flex items-center justify-center gap-2.5">
//               <span>Load More</span>
//               <ChevronDown />
//             </button>
//           </div>
//         </div>
//       </div>
//     </Wrapper>
//   );
// };

// const categories = [
//   { name: "Valentine's Day", href: "/products/valentines" },
//   { name: "Anniversary", href: "/products/anniversary" },
//   { name: "Birthday", href: "/products/birthday" },
//   { name: "Congratulations", href: "/products/congratulations" },
// ];

// const Sidebar = () => {
//   const pathname = usePathname();
//   return (
//     <div className="flex flex-col h-screen pl-4 pb-24 gap-4 pt-24">
//       <h1 className="text-[24px] font-bold py-4 pl-4">Category</h1>
//       <div className="bg-[#00000005] pl-4 py-8 rounded-[8px]">
//         <nav>
//           <ul className="space-y-8">
//             {categories.map((category) => (
//               <li key={category.href}>
//                 <Link
//                   className={cn(
//                     "text-[20px] text-[#00000063] font-bold",
//                     pathname === category.href && "text-[#8300FF]"
//                   )}
//                   href={category.href}
//                 >
//                   {category.name}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </div>
//     </div>
//   );
// };

// export default ProductListPage;
