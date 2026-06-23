// src/components/OnboardingGuard.jsx - stable onboarding gating (no remount loops)
import React, { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import OnboardingForm from "./OnboardingForm";

const OnboardingGuard = ({ children }) => {
  const { user, updateUser } = useAuth();
  const needsOnboarding = useMemo(() => {
    if (!user) return false;
    // Admin users skip onboarding
    if (user.role === "admin") return false;

    const hasRequiredInfo =
      user.fullName &&
      user.phoneNumber &&
      user.province &&
      user.city &&
      user.courtName;

    const onboardingCompleted = user.onboardingCompleted === true;
    return !hasRequiredInfo || !onboardingCompleted;
  }, [user]);

  const handleOnboardingComplete = (updatedUser) => {
    if (updateUser) {
      updateUser({
        ...updatedUser,
        onboardingCompleted: true,
      });
    }
  };

  // Show onboarding if needed (overlay), otherwise show children.
  if (needsOnboarding && user) {
    return (
      <OnboardingForm
        onComplete={handleOnboardingComplete}
        userEmail={user.email}
      />
    );
  }

  return <>{children}</>;
};

export default OnboardingGuard;
