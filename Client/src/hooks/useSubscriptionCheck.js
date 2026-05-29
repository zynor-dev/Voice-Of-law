import { useState, useEffect, useCallback } from "react";
import {
  mapUserToSubscriptionStatus,
  fetchSubscriptionStatusFromProfile,
} from "../services/subscriptionStatus";

/**
 * Loads subscription / access state from the real backend user profile
 * (GET /api/v1/users/profile). No mock endpoints.
 */
export const useSubscriptionCheck = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSubscription = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      let user = null;
      try {
        user = JSON.parse(localStorage.getItem("user") || "null");
      } catch {
        user = null;
      }

      if (!token || !user) {
        setSubscriptionStatus({
          hasAccess: false,
          isTrialActive: false,
          isSubscribed: false,
          hasActiveSubscription: false,
          daysRemaining: 0,
        });
        setLoading(false);
        return;
      }

      if (user.role === "admin") {
        setSubscriptionStatus(mapUserToSubscriptionStatus(user));
        setLoading(false);
        return;
      }

      try {
        const status = await fetchSubscriptionStatusFromProfile();
        setSubscriptionStatus(status);
      } catch {
        setSubscriptionStatus(mapUserToSubscriptionStatus(user));
      }
    } catch (e) {
      console.error("Subscription check error:", e);
      setSubscriptionStatus({
        hasAccess: true,
        isTrialActive: true,
        isSubscribed: false,
        hasActiveSubscription: true,
        error: true,
        daysRemaining: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  const requiresSubscription = () => {
    if (!subscriptionStatus) return false;
    return (
      !subscriptionStatus.isTrialActive && !subscriptionStatus.isSubscribed
    );
  };

  const canAccessFeature = () => {
    if (!subscriptionStatus) return true;
    if (subscriptionStatus.error) return true;
    return (
      subscriptionStatus.isTrialActive ||
      subscriptionStatus.isSubscribed ||
      subscriptionStatus.hasActiveSubscription
    );
  };

  return {
    subscriptionStatus,
    loading,
    requiresSubscription,
    canAccessFeature,
    refreshStatus: checkSubscription,
  };
};

export default useSubscriptionCheck;
