
import HomeFront from "@/components/homeFront";
import AboutUs from "@/components/AboutUs";
import Community from "@/components/community";
import FrontTemplate from "@/components/frontTemplate";
import FeaturedGiftSection from "@/components/home/FeaturedGiftSection";
import Footer from "@/components/Footer";

import AdminGift from "@/components/AdminGift";

export default function home() {
  return (
    <>
      <HomeFront />
     
      <AboutUs />
      <Community />
      <FrontTemplate />
      
      <FeaturedGiftSection />

      <AdminGift/>
    </>
  );
}
