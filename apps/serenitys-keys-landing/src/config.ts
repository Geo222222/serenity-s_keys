export const BOOKING_BASE_URL = import.meta.env.VITE_BOOKING_BASE_URL ?? "http://localhost:3000";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
export const CONTACT_EMAIL = "hello@serenitykeys.com";

export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY ?? "";
export const STRIPE_TEST_MODE = STRIPE_PUBLISHABLE_KEY.startsWith("pk_test");

export const ROUTES = {
  programs: `${BOOKING_BASE_URL}/programs`,
  launchpad: `${BOOKING_BASE_URL}/launchpad`,
};

export const ANALYTICS = {
  enablePlausible: false,
};
