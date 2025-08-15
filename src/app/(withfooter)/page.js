
"use client"
import HomeFront from "@/components/homeFront";
import AboutUs from "@/components/AboutUs";
import { lazy, Suspense, useRef } from "react";

// Lazy load below-the-fold components
const Community = lazy(() => import("@/components/community"));
const FrontTemplate = lazy(() => import("@/components/frontTemplate"));
const Testimony = lazy(() => import("@/components/Testimony"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary_color"></div>
  </div>
);

export default function home() {
  const aboutUsRef = useRef(null);

  const scrollToAboutUs = () => {
    if (aboutUsRef.current) {
      aboutUsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Critical above-the-fold content - not lazy loaded */}
      <HomeFront onKnowMoreClick={scrollToAboutUs} />
      <AboutUs ref={aboutUsRef} />
      
      {/* Below-the-fold content - lazy loaded */}
      <Suspense fallback={<LoadingSpinner />}>
        <Community />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <FrontTemplate />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <Testimony />
      </Suspense>
    </>
  );
}
