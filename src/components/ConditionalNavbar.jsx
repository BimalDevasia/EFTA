"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

const ConditionalNavbar = () => {
  const pathname = usePathname();
  
  // Hide navbar on admin routes and order details pages
  const isAdminRoute = pathname?.startsWith('/admin');
  const isOrderDetailsRoute = pathname?.startsWith('/order-details');
  
  // Don't render navbar on admin pages or order details pages
  if (isAdminRoute || isOrderDetailsRoute) {
    return null;
  }
  
  return <Navbar />;
};

export default ConditionalNavbar;
