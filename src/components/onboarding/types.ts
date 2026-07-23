export type ServiceKey =
  | "business_website"
  | "ecommerce_website"
  | "seo"
  | "google_ads"
  | "google_merchant_center"
  | "gmb"
  | "meta_ads"
  | "consulting";

export interface OnboardingData {
  // Step 1 - About You
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  whatsapp: string;
  country: string;
  city: string;
  preferredContactTime: string;

  // Step 2 - Services
  services: ServiceKey[];

  // Step 3 - Business Profile
  aboutBusiness: string;
  industry: string;
  targetAudience: string;
  existingWebsite: string;
  socials: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
    x: string;
  };
  brandColors: string[]; // hex values
  brandColorsNote: string;
  designReferences: string;
  logoFileName: string;
  logoStoragePath: string;

  // Step 4 - Website
  platform: string; // wordpress | shopify | woocommerce | no_preference | ""
  pageScope: string; // single | basic5 | more
  extraPagesCount: string;
  extraPagesList: string;
  ecomProductCount: string;
  ecomImportHelp: string;
  ecomPaymentGateways: string[];
  ecomShippingRegions: string;
  domainName: string;
  domainStatus: string; // purchased | need_help | ""
  domainRegistrar: string;
  hosting: string; // standard | premium_cloudways | own
  contentReadiness: string;
  multilingual: string;
  languages: string;
  launchDate: string;

  // Step 5 - Marketing
  marketingGoals: string[];
  targetCustomerBrief: string;
  keywords: string;
  targetLocations: string;
  competitors: string;
  googleAdsBudget: string;
  metaAdsBudget: string;
  googleAdsAccountId: string;
  metaBusinessId: string;
  existingTracking: string[]; // ga4, gsc, gmc, meta_pixel
  gmbUrl: string;

  // Step 6 - Add-ons
  addons: string[];
  addonsNote: string;

  // Step 7 - Budget & Timeline
  overallBudget: string;
  timelineUrgency: string;
  referralSource: string;
  additionalNotes: string;

  // Step 8 - Consent
  consent: boolean;
}

export const defaultData: OnboardingData = {
  fullName: "",
  businessName: "",
  email: "",
  phone: "",
  whatsapp: "",
  country: "",
  city: "",
  preferredContactTime: "",
  services: [],
  aboutBusiness: "",
  industry: "",
  targetAudience: "",
  existingWebsite: "",
  socials: { facebook: "", instagram: "", linkedin: "", youtube: "", tiktok: "", x: "" },
  brandColors: ["", "", ""],
  brandColorsNote: "",
  designReferences: "",
  logoFileName: "",
  logoStoragePath: "",
  platform: "",
  pageScope: "",
  extraPagesCount: "",
  extraPagesList: "",
  ecomProductCount: "",
  ecomImportHelp: "",
  ecomPaymentGateways: [],
  ecomShippingRegions: "",
  domainName: "",
  domainStatus: "",
  domainRegistrar: "",
  hosting: "",
  contentReadiness: "",
  multilingual: "",
  languages: "",
  launchDate: "",
  marketingGoals: [],
  targetCustomerBrief: "",
  keywords: "",
  targetLocations: "",
  competitors: "",
  googleAdsBudget: "",
  metaAdsBudget: "",
  googleAdsAccountId: "",
  metaBusinessId: "",
  existingTracking: [],
  gmbUrl: "",
  addons: [],
  addonsNote: "",
  overallBudget: "",
  timelineUrgency: "",
  referralSource: "",
  additionalNotes: "",
  consent: false,
};

export const SERVICE_OPTIONS: { key: ServiceKey; label: string; description: string }[] = [
  { key: "business_website", label: "Business Website", description: "WordPress or custom-built brochure/company site" },
  { key: "ecommerce_website", label: "E-Commerce Website", description: "Shopify or WooCommerce online store" },
  { key: "seo", label: "SEO", description: "On-page, technical & content SEO" },
  { key: "google_ads", label: "Google Ads", description: "Search, Display, Performance Max & Shopping" },
  { key: "google_merchant_center", label: "Google Merchant Center", description: "Product feed setup & optimization" },
  { key: "gmb", label: "Google My Business", description: "GMB profile optimization & posts" },
  { key: "meta_ads", label: "Meta Ads", description: "Facebook/Instagram ads including Shopping" },
  { key: "consulting", label: "Not sure yet / Consulting", description: "Let's talk through what you need" },
];

export const ADDON_OPTIONS = [
  { key: "custom_email", label: "Custom business email (info@yourdomain.com)" },
  { key: "transactional_email", label: "Transactional email provider (SendGrid / Brevo / Mailgun) for better deliverability" },
  { key: "login_security", label: "Login security (reCAPTCHA on login, 2FA, limit login attempts)" },
  { key: "form_spam_protection", label: "Form spam protection (reCAPTCHA / Akismet / Turnstile)" },
  { key: "image_optimization", label: "Image optimization plugin" },
  { key: "seo_plugin", label: "SEO plugin (Yoast / RankMath)" },
  { key: "ga4", label: "Google Analytics 4 integration" },
  { key: "gsc", label: "Google Search Console integration" },
  { key: "meta_pixel", label: "Meta Pixel integration" },
  { key: "cookie_banner", label: "Cookie consent / GDPR banner" },
  { key: "backups", label: "Backup & auto-update service" },
  { key: "sitemap", label: "Sitemap + robots.txt setup" },
  { key: "schema", label: "Schema markup / rich snippets" },
  { key: "cdn", label: "CDN / performance optimization" },
  { key: "maintenance", label: "Monthly maintenance retainer" },
];
