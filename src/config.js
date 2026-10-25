/** Client-approved values only. Empty integrations deliberately remain in preview mode. */
export const CONFIG = {
  checkoutEGP: "",
  checkoutUSD: "",
  leadEndpoint: "",
  campaignStart: "", // ISO 8601 including timezone, e.g. a client-confirmed +02:00 timestamp
  campaignDays: 5,
  prices: {
    EGP: { base: 3500, introductory: 700 },
    USD: { base: 65, introductory: 13 },
  },
  introVideo: "", // Direct video file URL, not a third-party embed URL
  beforeAudio: "",
  afterAudio: "",
  instructorPortrait: "",
  projectStills: [], // Up to five approved image paths in sound-study order
  ratingVerified: false,
  experienceVerified: false,
  refundTermsVerified: false,
  refundTermsURL: "",
  privacyURL: "",
  canonicalURL: "",
  socialImage: "",
};
export function campaign(now = Date.now()) {
  const start = Date.parse(CONFIG.campaignStart);
  if (!Number.isFinite(start)) return { status: "unconfigured", active: false };
  const end = start + CONFIG.campaignDays * 86400000;
  return {
    start,
    end,
    active: now >= start && now < end,
    status: now < start ? "scheduled" : now >= end ? "expired" : "active",
  };
}
