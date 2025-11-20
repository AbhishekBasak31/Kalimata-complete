import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProductSection from "@/components/ProductSection";
import SubcategoryScroller from "@/components/SubcategoryScroller"; // ✅ Import new scroller
import ServicesSection from "@/components/ServicesSection";
import ClientsSection from "@/components/ClientsSection";
import TimelineSection from "@/components/TimelineSection";
import GrowthGraphSection from "@/components/GrowthGraphSection";
import HomeDirectors from "@/components/HomeDirectors";
import MissionVisionSection from "@/components/MissionVisionSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 🌐 Header */}
      <Header />

      {/* 🏠 Hero Section */}
      <HeroSection />

      {/* 🏢 About Section */}
      <AboutSection />

      {/* 🏗️ Product Section */}
      <ProductSection />

      {/* 🌀 Subcategory Scroller */}
      {/* <SubcategoryScroller /> */}

      {/* 🧰 Services Section */}
      <ServicesSection />

      {/* 👥 Clients Section */}
      {/* <ClientsSection /> */}

      {/* 📊 Growth Graph Section */}
      <GrowthGraphSection />

      {/* 🕒 Timeline / Milestones Section */}
      <TimelineSection />

      {/* 👨‍💼 Board of Directors Section */}
      <HomeDirectors />

      {/* 🌍 Mission & Vision Section */}
      <MissionVisionSection />

      {/* 📞 Contact Section */}
      <ContactSection />

      {/* ⚙️ Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default Index;
