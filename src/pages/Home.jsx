// src/pages/Home.jsx
import React from "react";
import HeroSection from "../components/LandingPage/HeroSection";
import AIAssistantSection from "../components/LandingPage/AIAssistantSection";
import FeaturesBentoSection from "../components/LandingPage/FeaturesBentoSection";
import DashboardShowcase from "../components/LandingPage/DashboardShowcase";

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
      <WhyLegal />
      <FaqPage />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
