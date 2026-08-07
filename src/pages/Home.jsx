// src/pages/Home.jsx
import React from "react";
import HeroSection from "../components/LandingPage/HeroSection";
import AIAssistantSection from "../components/LandingPage/AIAssistantSection";
import FeaturesBentoSection from "../components/LandingPage/FeaturesBentoSection";
import DashboardShowcase from "../components/LandingPage/DashboardShowcase";
import PricingSection from "../components/LandingPage/PricingSection";

import WhyLegal from "./Whylegal";
import FaqPage from "./FaqPage";
import Contact from "./Contact";
import Footer from "../components/LandingPage/Footer";

const Home = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <HeroSection />
      <AIAssistantSection />
      <FeaturesBentoSection />
      <DashboardShowcase />
      <PricingSection />
      <WhyLegal />
      <FaqPage />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
