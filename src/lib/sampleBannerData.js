// Sample banner data for testing
// This would normally be created through the admin interface

const sampleBanners = [
  {
    title: "Valentine",
    subtitle: "Surprise your",
    pageType: "gifts",
    buttonText: "Shop Now",
    image: {
      url: "./giftmain.png",
      public_id: "sample_gift_banner",
      alt: "Gift banner"
    },
    isActive: true
  },
  {
    title: "Style", 
    subtitle: "Celebrate In",
    pageType: "events",
    buttonText: "Shop Now",
    image: {
      url: "./eventmain.png", 
      public_id: "sample_event_banner",
      alt: "Event banner"
    },
    isActive: true
  },
  {
    title: "Creativity",
    subtitle: "Unlock",
    pageType: "courses", 
    buttonText: "Shop Now",
    image: {
      url: "./coursesfront.png",
      public_id: "sample_course_banner", 
      alt: "Course banner"
    },
    isActive: true
  },
  {
    title: "Company",
    subtitle: "Brand your", 
    pageType: "corporate",
    buttonText: "Shop Now",
    image: {
      url: "./coperatefront.png",
      public_id: "sample_corporate_banner",
      alt: "Corporate banner"
    },
    isActive: true
  }
];

export default sampleBanners;
