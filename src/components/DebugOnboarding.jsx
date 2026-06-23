// src/components/DebugOnboarding.jsx
import React, { useEffect } from "react";

const DebugOnboarding = () => {
  useEffect(() => {
    console.log("=== ONBOARDING DEBUGGER ===");
    console.log("1. Checking localStorage...");

    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("voicelaw_user");
    const user = userStr ? JSON.parse(userStr) : null;

    console.log("2. Token exists:", !!token);
    console.log("3. User data:", user);

    if (user) {
      console.log("4. User has fullName:", !!user.fullName);
      console.log("5. User has phoneNumber:", !!user.phoneNumber);
      console.log("6. User has courtName:", !!user.courtName);
      console.log("7. onboardingCompleted:", user.onboardingCompleted);

      // Check if user needs onboarding
      const needsOnboarding =
        !user.fullName || !user.phoneNumber || !user.courtName;
      console.log("8. User needs onboarding:", needsOnboarding);

      // Force onboarding for testing if URL has parameter
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("forceOnboarding") === "true") {
        console.log("9. FORCING ONBOARDING FOR TESTING...");
        const testUser = {
          ...user,
          fullName: "",
          phoneNumber: "",
          courtName: "",
          onboardingCompleted: false,
        };
        localStorage.setItem("voicelaw_user", JSON.stringify(testUser));
        // No hard reload: keep SPA stable during dev.
        window.location.href = window.location.pathname;
      }
    }

    console.log("=== DEBUG COMPLETE ===");
  }, []);

  return null; // This component doesn't render anything visible
};

export default DebugOnboarding;
