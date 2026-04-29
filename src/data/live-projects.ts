// Live operating businesses tracked publicly.
//
// Every metric carries a typed `source` describing how the value would be
// fetched from the underlying system. Today the page renders `value` as a
// placeholder string; a future pass can swap that for a live read using the
// shape declared here. The union is intentionally explicit so that wiring
// each business is a mechanical translation, not a redesign.

export type MetricSource =
  | {
      kind: "supabase";
      table: string;
      query: string;
      description: string;
    }
  | {
      kind: "prisma";
      model: string;
      query: string;
      description: string;
    }
  | {
      kind: "api";
      endpoint: string;
      field: string;
      description: string;
    }
  | {
      kind: "manual";
      description: string;
    };

export interface MetricDelta {
  window: string; // human label, e.g. "7d", "30d", "MoM"
  pct: number | null; // signed percentage; null = placeholder, fill once wired
}

export interface OpsMetric {
  label: string;
  value: string;
  hint?: string;
  source: MetricSource;
  delta: MetricDelta;
}

export interface ActivityEntry {
  date: string; // ISO yyyy-mm-dd
  note: string;
}

export interface BusinessLinks {
  live?: string;
  repo?: string;
  dashboard?: string;
}

export type BusinessStatus = "live" | "in-progress" | "paused";

export interface LiveProject {
  slug: string;
  title: string;
  emoji: string;
  image?: string;
  imagePosition?: string;
  status: BusinessStatus;
  tagline: string;
  year: string;
  summary: string;
  model: string;
  stack: string[];
  metrics: OpsMetric[]; // business KPIs
  platformMetrics: OpsMetric[]; // operational/platform numbers (traffic, LLM, signups, errors)
  focus: string[];
  activity: ActivityEntry[];
  links: BusinessLinks;
}

export const liveProjects: LiveProject[] = [
  {
    slug: "fix-my-furnace",
    title: "Fix My Furnace",
    emoji: "🔥",
    status: "live",
    tagline: "Michigan HVAC marketplace",
    year: "2025",
    summary:
      "Two-sided lead-gen platform that connects Michigan homeowners with vetted HVAC contractors and surfaces real contract pricing.",
    model:
      "Per-lead fees from contractors plus $125 home visits. Pricing transparency and the contractor directory drive intent traffic into the lead funnels.",
    stack: ["Astro", "Supabase", "Mapbox", "Netlify"],
    metrics: [
      {
        label: "Leads Captured",
        value: "—",
        hint: "all-time",
        source: {
          kind: "supabase",
          table: "form_submissions",
          query: "select count(*) from form_submissions",
          description: "Total customer leads submitted across every form on the site.",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "Active Contractors",
        value: "—",
        hint: "approved",
        source: {
          kind: "supabase",
          table: "provider_applications",
          query:
            "select count(*) from provider_applications where status = 'approved'",
          description: "Contractors approved and visible in the partner directory.",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "Contracts Published",
        value: "—",
        hint: "pricing transparency",
        source: {
          kind: "supabase",
          table: "service_contracts",
          query:
            "select count(*) from service_contracts where status = 'approved'",
          description: "Customer-uploaded service contracts approved for the public pricing database.",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "Cities Served",
        value: "—",
        hint: "distinct service areas",
        source: {
          kind: "supabase",
          table: "form_submissions",
          query:
            "select count(distinct city) from form_submissions where city is not null",
          description: "Distinct Michigan cities that have submitted at least one lead.",
        },
        delta: { window: "7d", pct: null },
      },
    ],
    platformMetrics: [
      {
        label: "Page Views",
        value: "—",
        hint: "site visitors",
        source: {
          kind: "api",
          endpoint: "GET https://plausible.io/api/v1/stats/aggregate?site_id=fixmyfurnacedetroit.com&period=7d&metrics=pageviews",
          field: "results.pageviews.value",
          description: "7-day page-view count from Plausible analytics for the marketing site.",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "Signups",
        value: "—",
        hint: "new leads",
        source: {
          kind: "supabase",
          table: "form_submissions",
          query:
            "select count(*) from form_submissions where created_at >= now() - interval '7 days'",
          description: "New customer leads submitted in the last 7 days.",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "LLM Calls",
        value: "—",
        hint: "agent activity",
        source: {
          kind: "api",
          endpoint:
            "GET https://agentland.dev/api/v1/llm/usage?workspace=fix-my-furnace&from=-7d",
          field: "totalCalls",
          description: "Calls to Agentland's LLM service made by agents working on this business in the last 7 days.",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "Errors",
        value: "—",
        hint: "site + API",
        source: {
          kind: "api",
          endpoint:
            "GET https://sentry.io/api/0/projects/fix-my-furnace/issues/?statsPeriod=7d",
          field: "issuesCount",
          description: "Unresolved error events tracked by Sentry over the last 7 days.",
        },
        delta: { window: "7d", pct: null },
      },
    ],
    focus: [
      "Tighten the photo-diagnosis funnel conversion",
      "Onboard 5 more vetted contractors in metro Detroit",
      "Expand pricing transparency beyond furnaces (boilers, AC)",
    ],
    activity: [
      { date: "2026-04-25", note: "Shipped pricing-transparency moderation portal" },
      { date: "2026-04-18", note: "Mapbox autocomplete added to all service-page forms" },
      { date: "2026-04-10", note: "Approved 3 contractors in the Grand Rapids region" },
    ],
    links: {
      live: "https://fixmyfurnacedetroit.com",
      repo: "https://github.com/taketaketaketake/Fix-my-Furnace",
    },
  },

  {
    slug: "bags-of-laundry",
    title: "Bags of Laundry",
    emoji: "🧺",
    status: "live",
    tagline: "Detroit laundry pickup, delivered",
    year: "2025",
    summary:
      "End-to-end laundry-service platform with automatic ZIP-based laundromat routing, a four-stage driver workflow with photo proof, and Stripe-billed memberships layered over per-pound and per-bag pricing.",
    model:
      "Per-pound and per-bag service revenue plus $49.99 / 6-month memberships billed via Stripe. Partner laundromats earn revenue share per processed order.",
    stack: ["Astro", "React", "Prisma", "PostgreSQL", "Stripe", "Twilio"],
    metrics: [
      {
        label: "Orders MTD",
        value: "—",
        hint: "month-to-date",
        source: {
          kind: "prisma",
          model: "order",
          query:
            "prisma.order.count({ where: { createdAt: { gte: startOfMonth(now) } } })",
          description: "Orders created since the first of the current month.",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "Active Members",
        value: "—",
        hint: "subscriptions",
        source: {
          kind: "prisma",
          model: "membership",
          query: "prisma.membership.count({ where: { status: 'active' } })",
          description: "Members with an active Stripe subscription.",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "Partner Laundromats",
        value: "—",
        hint: "active partners",
        source: {
          kind: "prisma",
          model: "laundromat",
          query: "prisma.laundromat.count({ where: { isActive: true } })",
          description: "Active partner laundromats accepting routed orders.",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "Avg Ticket",
        value: "—",
        hint: "$/order, last 30d",
        source: {
          kind: "prisma",
          model: "order",
          query:
            "prisma.order.aggregate({ _avg: { totalCents: true }, where: { createdAt: { gte: thirtyDaysAgo } } })",
          description: "Average order total over the last 30 days, in cents.",
        },
        delta: { window: "7d", pct: null },
      },
    ],
    platformMetrics: [
      {
        label: "Page Views",
        value: "—",
        hint: "site visitors",
        source: {
          kind: "api",
          endpoint: "GET https://plausible.io/api/v1/stats/aggregate?site_id=bagsoflaundry.com&period=7d&metrics=pageviews",
          field: "results.pageviews.value",
          description: "7-day page-view count from Plausible analytics.",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "Signups",
        value: "—",
        hint: "new customers",
        source: {
          kind: "prisma",
          model: "customer",
          query:
            "prisma.customer.count({ where: { createdAt: { gte: sevenDaysAgo } } })",
          description: "Customers created in the last 7 days.",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "LLM Calls",
        value: "—",
        hint: "agent activity",
        source: {
          kind: "api",
          endpoint:
            "GET https://agentland.dev/api/v1/llm/usage?workspace=bags-of-laundry&from=-7d",
          field: "totalCalls",
          description: "Calls to Agentland's LLM service for this business in the last 7 days.",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "Errors",
        value: "—",
        hint: "site + API",
        source: {
          kind: "api",
          endpoint:
            "GET https://sentry.io/api/0/projects/bags-of-laundry/issues/?statsPeriod=7d",
          field: "issuesCount",
          description: "Unresolved error events tracked by Sentry over the last 7 days.",
        },
        delta: { window: "7d", pct: null },
      },
    ],
    focus: [
      "Smooth out the Saturday capacity crunch with a 4th partner",
      "Convert non-member trial customers to the 6-month plan",
      "Cut driver-pickup-to-laundromat time by 15%",
    ],
    activity: [
      { date: "2026-04-22", note: "Onboarded Westside Laundry Hub as 3rd partner" },
      { date: "2026-04-15", note: "Shipped weight-adjustment flow with auto re-charge" },
      { date: "2026-04-05", note: "Drivers fully migrated to photo-proof workflow" },
    ],
    links: {
      live: "https://bagsoflaundry.com",
      repo: "https://github.com/taketaketaketake/bol",
    },
  },

  {
    slug: "detroit-small-business-map",
    title: "Detroit Small Business Map",
    emoji: "🗺️",
    status: "live",
    tagline: "A self-enriching Detroit business directory",
    year: "2025",
    summary:
      "Discovery-to-publish pipeline that finds Detroit businesses, enriches them through SERP, Google Places, Geoapify and Gemini, then promotes them to a public neighborhood-aware directory.",
    model:
      "Free for residents and visitors today. Long-term: claimed-listing upgrades, owner-side lead capture, and sponsored neighborhood features.",
    stack: ["Hono", "Astro", "React", "Prisma", "PostgreSQL", "Mapbox", "Gemini"],
    metrics: [
      {
        label: "Listings Live",
        value: "—",
        hint: "promoted businesses",
        source: {
          kind: "api",
          endpoint: "GET /api/v1/businesses?count=true",
          field: "total",
          description: "Total businesses in the public production table.",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "Listings Staged",
        value: "—",
        hint: "in pipeline",
        source: {
          kind: "api",
          endpoint: "GET /api/v1/enrichment/pipeline-stats",
          field: "staged",
          description: "Businesses in `business_directory` awaiting promotion to production.",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "Neighborhoods",
        value: "—",
        hint: "covered",
        source: {
          kind: "api",
          endpoint: "GET /api/v1/neighborhoods",
          field: "length",
          description: "Distinct Detroit neighborhoods with at least one published business.",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "Pipeline Pending",
        value: "—",
        hint: "needs enrichment",
        source: {
          kind: "api",
          endpoint: "GET /api/v1/enrichment/pipeline-stats",
          field: "pendingEnrichment",
          description: "Discovered candidates that still need SERP, Places, or Gemini enrichment.",
        },
        delta: { window: "7d", pct: null },
      },
    ],
    platformMetrics: [
      {
        label: "Page Views",
        value: "—",
        hint: "site visitors",
        source: {
          kind: "api",
          endpoint:
            "POST https://posthog.com/api/projects/{id}/insights/trend?events=$pageview&date_from=-7d",
          field: "result.aggregated_value",
          description: "7-day page-view count from PostHog for takedetroit.com.",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "Signups",
        value: "—",
        hint: "new accounts",
        source: {
          kind: "prisma",
          model: "profile",
          query:
            "prisma.profile.count({ where: { createdAt: { gte: sevenDaysAgo } } })",
          description: "Profiles created in the last 7 days.",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "LLM Calls",
        value: "—",
        hint: "Gemini + agents",
        source: {
          kind: "api",
          endpoint:
            "GET https://agentland.dev/api/v1/llm/usage?workspace=detroit-small-business-map&from=-7d",
          field: "totalCalls",
          description: "Gemini calls for enrichment plus Agentland agent calls in the last 7 days.",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "Errors",
        value: "—",
        hint: "API + pipeline",
        source: {
          kind: "api",
          endpoint:
            "GET https://sentry.io/api/0/projects/detroit-small-business-map/issues/?statsPeriod=7d",
          field: "issuesCount",
          description: "Unresolved error events from the Hono API and enrichment pipeline.",
        },
        delta: { window: "7d", pct: null },
      },
    ],
    focus: [
      "Promote 100 more businesses to live this month",
      "Expand neighborhood coverage beyond the central core",
      "Wire claim-flow notifications to owner email",
    ],
    activity: [
      { date: "2026-04-20", note: "Promoted 42 enriched businesses to production" },
      { date: "2026-04-12", note: "Added Gemini-generated neighborhood blurbs" },
      { date: "2026-04-02", note: "Shipped enrichment-pipeline dashboard" },
    ],
    links: {
      live: "https://takedetroit.com",
      repo: "https://github.com/taketaketaketake/detroit-small-business-map",
      dashboard: "https://takedetroit.com/dashboard/enrichment-pipeline",
    },
  },

  {
    slug: "nurse-app",
    title: "Nurse App",
    emoji: "🩺",
    status: "in-progress",
    tagline: "Real-time patient voice during care",
    year: "2026",
    summary:
      "A platform for patients to speak about nursing care while still receiving it. Live AOL-style chat for in-the-moment expression, plus structured 1–5 reviews of role + unit + shift encounters that aggregate into accountability signals.",
    model:
      "Hospital and nursing-home subscriptions for the dashboard view of aggregated signals. The patient-facing experience stays free.",
    stack: ["Express", "TypeScript", "Socket.io", "Prisma", "PostgreSQL", "Better Auth"],
    metrics: [
      {
        label: "Encounters Reviewed",
        value: "—",
        hint: "structured reviews",
        source: {
          kind: "prisma",
          model: "review",
          query: "prisma.review.count()",
          description: "Total structured 1–5 reviews submitted across all encounters.",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "Hospitals Indexed",
        value: "—",
        hint: "facilities",
        source: {
          kind: "prisma",
          model: "hospital",
          query: "prisma.hospital.count()",
          description: "Hospitals plus nursing homes available for review.",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "Avg Signal Score",
        value: "—",
        hint: "1–5 across reviews",
        source: {
          kind: "prisma",
          model: "review",
          query:
            "prisma.review.aggregate({ _avg: { signalScore: true } })",
          description: "Mean of all signal-score fields across reviews.",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "Live Messages Today",
        value: "—",
        hint: "ephemeral chat",
        source: {
          kind: "prisma",
          model: "chatMessage",
          query:
            "prisma.chatMessage.count({ where: { createdAt: { gte: startOfToday() } } })",
          description: "Live-chat messages posted since midnight (72-hour TTL).",
        },
        delta: { window: "7d", pct: null },
      },
    ],
    platformMetrics: [
      {
        label: "Page Views",
        value: "—",
        hint: "site visitors",
        source: {
          kind: "api",
          endpoint:
            "GET https://plausible.io/api/v1/stats/aggregate?site_id=nurse-app&period=7d&metrics=pageviews",
          field: "results.pageviews.value",
          description: "7-day page-view count from Plausible analytics. Site URL pending pilot launch.",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "Signups",
        value: "—",
        hint: "new users",
        source: {
          kind: "prisma",
          model: "user",
          query:
            "prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } })",
          description: "Users created in the last 7 days via Better Auth (magic link or Google OAuth).",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "LLM Calls",
        value: "—",
        hint: "moderation + agents",
        source: {
          kind: "api",
          endpoint:
            "GET https://agentland.dev/api/v1/llm/usage?workspace=nurse-app&from=-7d",
          field: "totalCalls",
          description: "Calls to Agentland's LLM service for this business in the last 7 days.",
        },
        delta: { window: "7d", pct: null },
      },
      {
        label: "Errors",
        value: "—",
        hint: "API + WebSocket",
        source: {
          kind: "api",
          endpoint:
            "GET https://sentry.io/api/0/projects/nurse-app/issues/?statsPeriod=7d",
          field: "issuesCount",
          description: "Unresolved error events from the Express API and WebSocket layer.",
        },
        delta: { window: "7d", pct: null },
      },
    ],
    focus: [
      "Ship the encounter-aggregation view for facility admins",
      "Pilot with one Detroit-area facility",
      "Tighten the regex moderation pipeline",
    ],
    activity: [
      { date: "2026-04-26", note: "Encounter aggregation queries land in main" },
      { date: "2026-04-15", note: "Magic-link sign-in via Resend wired up" },
      { date: "2026-04-08", note: "Live-chat 72-hour TTL implemented" },
    ],
    links: {
      repo: "https://github.com/taketaketaketake/nurse-app",
    },
  },
];
