
import HomeFront from "@/components/homeFront";
import AboutUs from "@/components/aboutUs";
import Community from "@/components/community";
import FrontTemplate from "@/components/frontTemplate";
import FeaturedGiftSection from "@/components/home/FeaturedGiftSection";
import Footer from "@/components/Footer";
import NormalCardCarousal from "@/components/NormalCardCarousal";
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
