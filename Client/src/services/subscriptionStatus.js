/**
 * Subscription / access flags derived from the real User document (GET /users/profile).
 * Replaces legacy `/api/subscription/status` which is not mounted on this API.
 */
import { userAPI } from "./api";

export function mapUserToSubscriptionStatus(user) {
  if (!user) {
    return {
      hasAccess: false,
      isTrialActive: false,
      isSubscribed: false,
      hasActiveSubscription: false,
      daysRemaining: 0,
    };
  }

  if (user.role === "admin") {
    return {
      hasAccess: true,
      isTrialActive: false,
      isSubscribed: true,
      hasActiveSubscription: true,
      daysRemaining: 999,
      isAdmin: true,
    };
  }

  const sub = user.subscription || {};
  const plan = sub.plan || "free";
  const endDate = sub.endDate ? new Date(sub.endDate) : null;
  const now = new Date();

  const trialActive =
    plan === "trial" &&
    sub.isActive !== false &&
    endDate != null &&
    !Number.isNaN(endDate.getTime()) &&
    endDate > now;

  const premiumActive = plan === "premium" && sub.isActive === true;

  const hasActiveSubscription = trialActive || premiumActive;

  let daysRemaining = 0;
  if (endDate && endDate > now) {
    daysRemaining = Math.ceil(
      (endDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
    );
  }

  return {
    hasAccess: hasActiveSubscription,
    isTrialActive: trialActive,
    isSubscribed: premiumActive,
    hasActiveSubscription,
    daysRemaining,
  };
}

export async function fetchSubscriptionStatusFromProfile() {
  const { data } = await userAPI.getProfile();
  const user = data?.user;
  return mapUserToSubscriptionStatus(user);
}
